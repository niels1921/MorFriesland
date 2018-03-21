using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MorFriesland.Models.AccountViewModels
{
    public class AddUserRoleViewModel
    {
        [Required]
        public string UserName { get; set; }
        [ForeignKey("UserName")]
        public string Name { get; set; }
        [ForeignKey("Name")] 
        public int RoleAddId { get; set; }
    }
}
