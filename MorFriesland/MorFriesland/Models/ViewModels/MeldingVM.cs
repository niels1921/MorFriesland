using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MorFriesland.Models.ViewModels
{
    public class MeldingVM
    {
        public IEnumerable<Melding> Meldingen { get; set; }
        public Melding Melding { get; set; }
    }
}
