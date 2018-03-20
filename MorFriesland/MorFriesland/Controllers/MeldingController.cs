using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MorFriesland.Data;
using MorFriesland.Models;

namespace MorFriesland.Controllers
{
    public class MeldingController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MeldingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Melding
        public async Task<IActionResult> Index()
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
        public IActionResult Nieuw()
        {
            ViewData["Categorie_Id"] = new SelectList(_context.Set<Categorie>(), "Id", "Id");
            ViewData["User_id"] = new SelectList(_context.Users, "Id", "Id");
            return View();
        }

        // POST: Melding/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Nieuw([Bind("Id,Categorie_Id,Beschrijving,Foto,Email,Long,Lat,Opgelosttijd,Gearchiveerd,User_id")] Melding melding)
        {
            if (ModelState.IsValid)
            {
                _context.Add(melding);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["Categorie_Id"] = new SelectList(_context.Set<Categorie>(), "Id", "Id", melding.Categorie_Id);
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
                return RedirectToAction(nameof(Index));
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
    }
}
