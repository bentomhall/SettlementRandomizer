using System;
using System.Collections.Generic;

namespace SettlementRandomizer
{
    class Program
    {
        static void Main(string[] args)
        {
            var gen = new SettlementGenerator();/*
            Console.WriteLine("Welcome to the random settlement generator");
            Console.WriteLine("Please select a size of city to generate");
            Console.Write("Valid sizes are Isolated, Hamlet, Thorpe, Village, Town, Shrine, or Castle: ");
            var size = Console.ReadLine();
            Console.Write("Enter the number of settlements to generate: ");
            var nInput = Console.ReadLine();
            if (!int.TryParse(nInput, out int number))
            {
                number = 1;
            }
            Console.Write("What is the nearest city? ");
            var nearest = Console.ReadLine();
            gen.Create(size, number, nearest);*/
            gen.Create("thorpe", 1, "Kaelthia");
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
