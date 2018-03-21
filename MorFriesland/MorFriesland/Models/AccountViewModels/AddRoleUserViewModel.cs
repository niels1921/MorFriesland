using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MorFriesland.Models.AccountViewModels
{
    public class AddRoleUserViewModel
    {
        [DisplayName("Gebruikersnaam")]
        public string UserName { get; set; }
        [ForeignKey("UserName")]
        [DisplayName("Rol naam")]
        public string Name { get; set; }
        [ForeignKey("Name")]
        public int id { get; set; }


    }
}
