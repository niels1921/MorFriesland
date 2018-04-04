using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MorFriesland.Models.AccountViewModels
{
    public class RegisterViewModel
    {
        [Required]
        [EmailAddress(ErrorMessage ="Voer een geldig e-mail adres in")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Het {0} moet minstens {2} en maximaal {1} karakters zijn.", MinimumLength = 1)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Bevestig wachtwoord")]
        [Compare("Password", ErrorMessage = "Het wachtwoord en de bevestiging komen niet overeen")]
        public string ConfirmPassword { get; set; }
    }
}
