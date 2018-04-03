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
        public string Gemeente { get; set; }

        [Required(ErrorMessage ="Vul een e-mailadres in")]
        [EmailAddress(ErrorMessage = "Dit is niet een geldig e-mailadres")]
        public string Email { get; set; }
    }
}
