using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MorFriesland.Data;
using MorFriesland.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Authorization;
 using System.Net.Mail;
using SendGrid.Helpers.Mail;
using SendGrid;

namespace MorFriesland.Controllers
{
    [Authorize(Roles = "Beheerder, Admin")]
    public class BeheerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private IHostingEnvironment _Environment;

        public BeheerController(ApplicationDbContext context, IHostingEnvironment environment)
        {
            _context = context;
            _Environment = environment;
        }

        // GET: Beheer
        public async Task<IActionResult> Index(string SearchString, bool gearchiveerd)
        {

            DateTime nu = DateTime.Now;
            nu = nu.AddDays(-1);

            ViewData["Categorie_Id"] = new SelectList(_context.Set<Categorie>(), "Naam", "Naam");
            //var applicationDbContext = _context.Melding.Include(m => m.Categorie).Include(m => m.Melder);

            var applicationDbContext = _context.Melding.Include(m => m.Categorie).Include(m => m.Melder);

            var meldingen = from x in applicationDbContext
                            where x.Opgelosttijd > nu || x.Opgelosttijd == null
                            select x;


                if ((gearchiveerd == true) && (!String.IsNullOrWhiteSpace(SearchString)))
                {
                    meldingen = from x in applicationDbContext
                                select x;

                    meldingen = meldingen.Where(s => s.Naam.Contains(SearchString));
                }
                else if (!String.IsNullOrWhiteSpace(SearchString))
                {
                    meldingen = meldingen.Where(s => s.Naam.Contains(SearchString));
                } else if (gearchiveerd == true)
                {
                    meldingen = from x in applicationDbContext
                            select x;

            }

         
            




            return View(await meldingen.ToListAsync());
        }

        // GET: Beheer/Details/5
        public async Task<IActionResult> Details(int? id)
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

        // GET: Beheer/Create
        public IActionResult Create()
        {
            ViewData["Categorie_Id"] = new SelectList(_context.Categorie, "Id", "Id");
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id");
            return View();
        }

        // POST: Beheer/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Categorie_Id,Beschrijving,Foto,Email,Long,Lat,Opgelosttijd,Gearchiveerd,User_id")] Melding melding)
        {
            if (ModelState.IsValid)
            {
                _context.Add(melding);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["Categorie_Id"] = new SelectList(_context.Categorie, "Id", "Id", melding.Categorie_Id);
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id", melding.User_id);
            return View(melding);
        }

        // GET: Beheer/Edit/5
        public async Task<IActionResult> Edit(int? id)
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
            ViewData["Categorie_Id"] = new SelectList(_context.Categorie, "Id", "Id", melding.Categorie_Id);
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id", melding.User_id);
            return View(melding);
        }

        // POST: Beheer/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Categorie_Id,Beschrijving,Foto,Email,Long,Lat,Opgelosttijd,Gearchiveerd,User_id")] Melding melding)
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

                return RedirectToAction(nameof(Index));
            }
            ViewData["Categorie_Id"] = new SelectList(_context.Categorie, "Id", "Id", melding.Categorie_Id);
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id", melding.User_id);
            return View(melding);
        }


        // POST: Beheer/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Oplossen(int id, [Bind("Id,Categorie_Id,Beschrijving,Foto,Email,Long,Lat,Opgelosttijd,Gearchiveerd,User_id,Gemeente,Naam")] Melding melding)
        {
            if (id != melding.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                var timezone = TimeZoneInfo.FindSystemTimeZoneById("Central Europe Standard Time");
                var dateTime = TimeZoneInfo.ConvertTime(DateTime.Now, timezone);
                melding.Opgelosttijd = dateTime;
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
                string beschrijving = melding.Beschrijving;
                if (melding.Opgelosttijd != null && melding.Email != "false@false.nl")
                {
                    var apiKey = Environment.GetEnvironmentVariable("SENDGRID_KEY");
                    var client = new SendGridClient(apiKey);
                    var from = new EmailAddress("boge1300@student.nhl.nl", "MOR Friesland");
                    var subject = "Melding" + melding.Naam;
                    var to = new EmailAddress(melding.Email);
                    var plainTextContent = "Opgelost";
                    var htmlContent = "Mail van de melding <br> Beschrijving: " + beschrijving + "<br> Is opgelost op: " + melding.Opgelosttijd;
                    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                    var response = await client.SendEmailAsync(msg);
                }
               
            }

            return RedirectToAction(nameof(Index));
        }


        // GET: Beheer/Delete/5
        public async Task<IActionResult> Delete(int? id)
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

        // POST: Beheer/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var melding = await _context.Melding.SingleOrDefaultAsync(m => m.Id == id);
            _context.Melding.Remove(melding);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }



        private bool MeldingExists(int id)
        {
            return _context.Melding.Any(e => e.Id == id);
        }

        
        public ActionResult Redirect()
        {
            return RedirectToAction(nameof(BronhouderController.Index), "Bronhouder");

        }

    }
}
