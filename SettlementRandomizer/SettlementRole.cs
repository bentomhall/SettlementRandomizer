using System.Collections.Generic;

namespace SettlementRandomizer
{
    internal class SettlementRole
    {
        internal string Name { get; set; }
        internal List<Specialty> Specialties { get; set; }
    }

    internal class Specialty
    {
        internal string Name { get; set; }
        internal int Modifier { get; set; }
    }
}