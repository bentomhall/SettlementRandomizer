using System;
namespace SettlementRandomizer
{
    public partial class SettlementOutput
    {
        public SettlementOutput(Settlement s, bool showCommon)
        {
            Settle = s;
            ShowCommonItems = showCommon;
        }

        public Settlement Settle { get; set; }
        public bool ShowCommonItems { get; set; }
    }
}
