using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MorFriesland.Data;
using MorFriesland.Models;

namespace MorFriesland.Controllers
{
    //[Authorize(Roles ="Admin, Beheerder")]
    public class BronhouderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BronhouderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Bronhouder
        public async Task<IActionResult> Index()
        {
            return View(await _context.Bronhouder.ToListAsync());
        }


        // GET: Bronhouder/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Bronhouder/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Gemeente,Email")] Bronhouder bronhouder)
        {
            if (ModelState.IsValid)
            {
                _context.Add(bronhouder);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(bronhouder);
        }

        // GET: Bronhouder/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var bronhouder = await _context.Bronhouder.SingleOrDefaultAsync(m => m.Id == id);
            if (bronhouder == null)
            {
                return NotFound();
            }
            return View(bronhouder);
        }

        // POST: Bronhouder/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Gemeente,Email")] Bronhouder bronhouder)
        {
            if (id != bronhouder.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(bronhouder);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BronhouderExists(bronhouder.Id))
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
            return View(bronhouder);
        }

        // GET: Bronhouder/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var bronhouder = await _context.Bronhouder
                .SingleOrDefaultAsync(m => m.Id == id);
            if (bronhouder == null)
            {
                return NotFound();
            }

            return View(bronhouder);
        }

        // POST: Bronhouder/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var bronhouder = await _context.Bronhouder.SingleOrDefaultAsync(m => m.Id == id);
            _context.Bronhouder.Remove(bronhouder);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool BronhouderExists(int id)
        {
            return _context.Bronhouder.Any(e => e.Id == id);
        }

        





    }
}
