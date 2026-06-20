using System;
using System.Linq;
using System.Reflection;
using Microsoft.OpenApi;

class Program
{
    static void Main()
    {
        var asm = typeof(Microsoft.OpenApi.OpenApiSpecVersion).Assembly;
        foreach (var type in asm.GetTypes().Where(t => t.Name.Contains("OpenApiReference") || t.Name.Contains("SecurityScheme")))
        {
            Console.WriteLine($"{type.Namespace} - {type.Name}");
        }
    }
}
