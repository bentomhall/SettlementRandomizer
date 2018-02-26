using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace SettlementRandomizer
{
    internal static class ConfigurationLoader
    {
        internal static List<T> GetConfiguration<T>(string filename)
        {
            var json = System.IO.File.ReadAllText(filename);
            return JsonConvert.DeserializeObject<List<T>>(json);
        }
    }
}
