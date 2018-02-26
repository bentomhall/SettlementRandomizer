using System;
using System.Collections.Generic;

namespace SettlementRandomizer
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to the random settlement generator");
            Console.Write("Please select a size of city to generate\nValid sizes are Isolated, Hamlet, Thorpe, Village, Town, Shrine, or Castle");
            var size = Console.ReadLine();
            Console.Write("Enter the number of settlements to generate: ");
            var nInput = Console.ReadLine();
            if (!int.TryParse(nInput, out int number))
            {
                number = 1;
            }
            Console.Write("What is the nearest city? ");
            var nearest = Console.ReadLine();
            var gen = new SettlementGenerator();
            gen.Create(size, number, nearest);
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
