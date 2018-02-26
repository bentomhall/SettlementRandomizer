using System.Collections.Generic;
using System.Linq;
namespace SettlementRandomizer
{
    public class ItemData
    {
        public string Category { get; set; }
        public string Subcategory { get; set; }
        public List<Item> Items { get; set; }

        public IEnumerable<Item> AvailableItems(int rank)
        {
            return Items.Where(x => x.Rank <= rank);
        }
    }
}