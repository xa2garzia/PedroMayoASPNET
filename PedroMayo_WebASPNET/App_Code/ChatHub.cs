using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace PedroMayo_WebASPNET.App_Code
{
    //Clase que gestiona las conexiones SignalR 
    //https://docs.microsoft.com/en-us/aspnet/signalr/overview/getting-started/tutorial-getting-started-with-signalr
    //https://channel9.msdn.com/Events/TechEd/NorthAmerica/2014/DEV-B416
    //https://mva.microsoft.com/en-US/training-courses/8358?l=FXkIQlFz_2904984382
    [HubName("chatHub")]
    public class ChatHub : Hub
    { 
        string connectionID = Context.ConnectionId;

        #region Lyfecicle

        public override Task OnConnected()
        {
            // Add your own code here.
            // For example: in a chat application, record the association between
            // the current connection ID and user name, and mark the user as online.
            // After the code in this method completes, the client is informed that
            // the connection is established; for example, in a JavaScript client,
            // the start().done callback is executed.
            return base.OnConnected();
        }

        //public override Task OnDisconnected()
        //{
        //    // Add your own code here.
        //    // For example: in a chat application, mark the user as offline, 
        //    // delete the association between the current connection id and user name.
        //    return base.OnDisconnected();
        //}

        public override Task OnReconnected()
        {
            // Add your own code here.
            // For example: in a chat application, you might have marked the
            // user as offline after a period of inactivity; in that case 
            // mark the user as online again.
            return base.OnReconnected();
        }

        #endregion

        //Clase publica que se llama desde el cliente
        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            //20/02/2018: Llama al método javaScript de las ventanas donde previamente nos hemos conectando al Hub desde javascript.
            /*Ejemplo: $(function () {
                var chat = $.connection.chatHub;
                }); */

            Clients.All.broadcastMessage(name, message);
            //Clients.Caller.broadcastMessage(name, message);
            //Clients.Others.broadcastMessage(name, message);
        }

        public IEnumerable<string> GetAllNames()
        {
            List<string> nombres = new List<string>();
            nombres.Add("List");
            return nombres;
        }

        /// <summary>
        /// Por ejemplo datos obtenidos por WebApi
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<string>> GetAllStocks()
        {
            // Returns data from a web service.
            //var uri = Util.getServiceUri("Stocks");
            //using (HttpClient httpClient = new HttpClient())
            //{
            //    var response = await httpClient.GetAsync(uri);
            //    return (await response.Content.ReadAsAsync<IEnumerable<Stock>>());
            //}
            List<string> nombres = new List<string>();
            nombres.Add("List");
            return nombres;
        }
    }
}