using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(PedroMayo_WebASPNET.Startup))]
namespace PedroMayo_WebASPNET
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            //app.MapSignalR();

            var hubConfiguration = new HubConfiguration();
            hubConfiguration.EnableDetailedErrors = true;
            //hubConfiguration.EnableJavaScriptProxies = false;
            hubConfiguration.EnableJavaScriptProxies = true;

            //Quitamos la ruta deafult
            app.MapSignalR("/pedromayo/signalr", hubConfiguration);
        }
    }
}