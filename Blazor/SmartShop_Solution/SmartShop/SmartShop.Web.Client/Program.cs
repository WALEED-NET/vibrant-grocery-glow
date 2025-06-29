using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SmartShop.Shared.Services;
using SmartShop.Web.Client.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Add device-specific services used by the SmartShop.Shared project
builder.Services.AddSingleton<IFormFactor, FormFactor>();

await builder.Build().RunAsync();
