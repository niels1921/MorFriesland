using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MorFriesland.Data;
using MorFriesland.Models;
using MorFriesland.Models.ViewModels;
using System.Net.Mail;
using SendGrid.Helpers.Mail;
using SendGrid;
using System.Globalization;

namespace MorFriesland.Controllers
{
    public class MeldingController : Controller
    {

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly ApplicationDbContext _context;

        private IHostingEnvironment _Environment;

        public MeldingController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHostingEnvironment environment)
        {
            _context = context;
            _userManager = userManager;
            _Environment = environment;
        }

        // GET: Melding
        public async Task<IActionResult> MijnMeldingen(Melding melding, string sortOrder)
        {
            ViewData["DateSortParm"] = sortOrder == "Date" ? "date_desc" : "Date";
            string userId = this.User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);

            ApplicationUser user = (from x in _context.Users
                                    where x.Id == userId
                                    select x).SingleOrDefault();

            var meldingen = from a in _context.Melding
                            where a.User_id == user.Id
                            select a;

            var datums = from s in _context.Melding.Include(s => s.Categorie).Include(s => s.Melder)
                         where s.User_id == user.Id
                         select s;

            switch (sortOrder)
            {
                case "Date":
                    datums = datums.OrderBy(s => s.Opgelosttijd);
                    break;
                case "date_desc":
                    datums = datums.OrderByDescending(s => s.Opgelosttijd);
                    break;
                default:
                    datums = datums.OrderByDescending(s => s.Opgelosttijd);
                    break;
            }

            return View(await datums.AsNoTracking().ToListAsync());
        }

        // GET: Melding
        public async Task<IActionResult> Alle()
        {          
            var applicationDbContext = _context.Melding.Include(m => m.Categorie).Include(m => m.Melder);
           
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: Melding/Details/5
        public async Task<IActionResult> Bekijk(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var melding = await _context.Melding
                .Include(m => m.Categorie)
                .Include(m => m.Melder)
                .SingleOrDefaultAsync(m => m.Id == id);
            if (melding == null)
            {
                return NotFound();
            }

            return View(melding);
        }

        // GET: Melding/Create
        public IActionResult Index()
        {
            ViewData["Categorie_Id"] = new SelectList(_context.Set<Categorie>(), "Id", "Naam");
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id");

            MeldingVM meldingen = new MeldingVM();

            var Meldingen = from Melding in _context.Melding
                        select Melding;

            meldingen.Meldingen = Meldingen;


            return View(meldingen);
        }

        // POST: Melding/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index([Bind("Id,Categorie_Id,Beschrijving,Foto,Email,Long,Lat,Gearchiveerd,User_id")] Melding melding, IFormFile Image)
        {
            string userId = this.User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);

            ApplicationUser user = (from x in _context.Users
                            where x.Id == userId
                            select x).SingleOrDefault();

            Categorie categorienaam = (from cat in _context.Categorie
                           where cat.Id == melding.Categorie_Id
                           select cat).SingleOrDefault();

            string naam = melding.Naam;

            melding.Naam = categorienaam.Naam;
            string beheerdermail = "";

            string email = melding.Email;

            if (ModelState.IsValid)
            {

                if (Image != null)
                {

                    string uploadPatch = Path.Combine(_Environment.WebRootPath, "uploads");
                    Directory.CreateDirectory(Path.Combine(uploadPatch, melding.Naam));

                    string FileName = Image.FileName;
                    if (FileName.Contains('\\'))
                    {
                        FileName = FileName.Split('\\').Last();
                    }

                    using (var stream = new FileStream(Path.Combine(uploadPatch, melding.Naam, FileName), FileMode.Create))
                    {
                        await Image.CopyToAsync(stream);
                    }
                    melding.Foto = FileName;
                }

                melding.Gearchiveerd = false;

                if (user != null)
                {
                    melding.Email = user.Email;
                    melding.User_id = userId;
                    melding.Melder = user;
                }
                else
                {
                    melding.User_id = null;
                }
                melding.Opgelosttijd = null;
                //Convert.ToDouble(3.2, CultureInfo.InvariantCulture);
                double lat = Convert.ToDouble(melding.Lat, CultureInfo.InvariantCulture);

                if(lat > 53.2012379)
                {
                    beheerdermail = "harm.vandenbogert@outlook.com";
                }
                else
                {
                    beheerdermail = " nieu1702@student.nhl.nl";
                }

                if (melding.Email != null)
                {
                    string mail = melding.Email;
                    string beschrijving = melding.Beschrijving;

                    var apiKey = Environment.GetEnvironmentVariable("SENDGRID_KEY", EnvironmentVariableTarget.User);
                    var client = new SendGridClient(apiKey);
                    var from = new EmailAddress("klaas.vanderwerk@gmail.com", "MOR Friesland");
                    var subject = "Melding" + melding.Naam;
                    var to = new EmailAddress(mail);
                    var plainTextContent = "koptext?";
                    var htmlContent = "Mail van de melding" + Environment.NewLine + "Beschrijving: " + beschrijving + Environment.NewLine;
                    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                    var response = await client.SendEmailAsync(msg);
                    var to2 = new EmailAddress(beheerdermail);
                    var htmlContent2 = "Mail van de melding" + Environment.NewLine + "Beschrijving: " + beschrijving + Environment.NewLine;
                    //beheerder linkje naar de melding detail pagina
                    var msg2 = MailHelper.CreateSingleEmail(from, to2, subject, plainTextContent, htmlContent2);
                    var response2 = await client.SendEmailAsync(msg2);
                }
                else
                {
                    string beschrijving = melding.Beschrijving;

                    var apiKey = Environment.GetEnvironmentVariable("SENDGRID_KEY", EnvironmentVariableTarget.User);
                    var client = new SendGridClient(apiKey);
                    var from = new EmailAddress("klaas.vanderwerk@gmail.com", "MOR Friesland");
                    var subject = "Melding" + melding.Naam;
                    var to = new EmailAddress(beheerdermail);
                    var plainTextContent = "koptext?";
                    var htmlContent = "Mail van de melding" + Environment.NewLine + "Beschrijving: " + beschrijving + Environment.NewLine;
                    //beheerder linkje naar de melding detail pagina
                    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                    var response = await client.SendEmailAsync(msg);
                }
                _context.Add(melding);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Alle));
            }

            
            ViewData["Categorie_Id"] = new SelectList(_context.Set<Categorie>(), "Id", "Naam", melding.Categorie_Id);
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id", melding.User_id);
            return View(melding);
        }

        // GET: Melding/Edit/5
        public async Task<IActionResult> Bewerk(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var melding = await _context.Melding.SingleOrDefaultAsync(m => m.Id == id);
            if (melding == null)
            {
                return NotFound();
            }
            ViewData["Categorie_Id"] = new SelectList(_context.Set<Categorie>(), "Id", "Id", melding.Categorie_Id);
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id", melding.User_id);
            return View(melding);
        }

        // POST: Melding/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Bewerk(int id, [Bind("Id,Categorie_Id,Beschrijving,Foto,Email,Long,Lat,Opgelosttijd,Gearchiveerd,User_id")] Melding melding)
        {
            if (id != melding.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(melding);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MeldingExists(melding.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Alle));
            }
            ViewData["Categorie_Id"] = new SelectList(_context.Set<Categorie>(), "Id", "Id", melding.Categorie_Id);
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id", melding.User_id);
            return View(melding);
        }

        // GET: Melding/Delete/5
        public async Task<IActionResult> Verwijder(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var melding = await _context.Melding
                .Include(m => m.Categorie)
                .Include(m => m.Melder)
                .SingleOrDefaultAsync(m => m.Id == id);
            if (melding == null)
            {
                return NotFound();
            }

            return View(melding);
        }

        // POST: Melding/Delete/5
        [HttpPost, ActionName("Verwijder")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var melding = await _context.Melding.SingleOrDefaultAsync(m => m.Id == id);
            _context.Melding.Remove(melding);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(MijnMeldingen));
        }

        private bool MeldingExists(int id)
        {   
            return _context.Melding.Any(e => e.Id == id);
        }
    }
}
