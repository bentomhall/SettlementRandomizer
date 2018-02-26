using System;
using System.Collections.Generic;

namespace SettlementRandomizer
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }

    public static class Extension
    {
        public static string Choice(this Random r, List<string> lst)
        {
            if (lst.Count == 0)
            {
                return "";
            }
            var index = r.Next(0, lst.Count);
            return lst[index];
        }
    }
}
