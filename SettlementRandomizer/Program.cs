using System;
using System.Collections.Generic;

namespace SettlementRandomizer
{
    class Program
    {
        static void Main(string[] args)
        {
            var gen = new SettlementGenerator();
            Console.WriteLine("Welcome to the random settlement generator");
            Console.WriteLine("Please select a size of city to generate");
            var types = gen.GetPossibleSettlementTypes();
            Console.WriteLine("Valid sizes are: (enter all for a full complement)");
            Console.WriteLine(FormatTypes(types));
            Console.Write("> ");
            var size = Console.ReadLine();
            Console.Write("Enter the number of settlements to generate: ");
            var nInput = Console.ReadLine();
            if (!int.TryParse(nInput, out int number))
            {
                number = 1;
            }
            Console.Write("What is the nearest city? ");
            var nearest = Console.ReadLine();
            gen.Create(size, number, nearest);
            Console.WriteLine("Press any key to contine...");
            Console.Read();
        }

        static string FormatTypes(IEnumerable<string> types)
        {
            return String.Join(Environment.NewLine, types);
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
