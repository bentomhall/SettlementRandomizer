using System.Collections.Generic;
using System.Linq;

namespace SettlementRandomizer
{
    internal class SettlementData
    {
        internal string Name { get; set; }
        internal int Population { get; set; }
        internal List<string> NPCs { get; set; }
        internal Dictionary<string, int> TechCaps { get; set; }
        internal List<NPCRandomizer.NamedRange> Roles { get; set; }

        internal string GetRole(double x)
        {
            return Roles.First(r => r.Start >= x && r.Stop < x).Name;
        }

    }
}