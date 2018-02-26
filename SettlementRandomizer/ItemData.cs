using System.Collections.Generic;
using System.Linq;
namespace SettlementRandomizer
{
    internal class ItemData
    {
        internal string Category { get; set; }
        internal string Subcategory { get; set; }
        internal List<Item> Items { get; set; }

        internal IEnumerable<Item> AvailableItems(int rank)
        {
            return Items.Where(x => x.Rank <= rank);
        }
    }
}