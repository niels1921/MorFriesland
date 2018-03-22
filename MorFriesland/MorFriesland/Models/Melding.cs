using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MorFriesland.Models
{
    public class Melding
    {
        public int Id { get; set; }
        public string Naam { get; set; }

        public int Categorie_Id { get; set; }
        [ForeignKey("Categorie_Id")]
        public Categorie Categorie { get; set; }
        public string Beschrijving { get; set; }
        public string Foto { get; set; }
        public string Email { get; set; }
        public string Long { get; set; }
        public string Lat { get; set; }
        public DateTime? Opgelosttijd { get; set; }
        public bool Gearchiveerd { get; set; }

        public string User_id { get; set; }
        [ForeignKey("User_id")]
        public ApplicationUser Melder { get; set; }
    }
}
