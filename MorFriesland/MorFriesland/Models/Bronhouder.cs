using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MorFriesland.Models
{
    public class Bronhouder
    {
        public int Id { get; set; }
        [Display(Name = "Gemeente code")]

        public string Gemeente { get; set; }
        public string Email { get; set; }
    }
}
