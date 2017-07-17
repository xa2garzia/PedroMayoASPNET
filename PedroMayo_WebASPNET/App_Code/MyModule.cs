using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PedroMayo_WebASPNET.App_Code
{
    public class MyModule : IHttpModule
    {
        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public void Init(HttpApplication context)
        {
            context.BeginRequest += new EventHandler(context_BeginRequest);
            context.PreRequestHandlerExecute += new EventHandler(context_PreRequestHandlerExecute);
            context.EndRequest += new EventHandler(context_EndRequest);
            //context.AuthorizeRequest += new EventHandler(context_AuthorizeRequest);
        }

        void context_AuthorizeRequest(object sender, EventArgs e)
        {
            //We change uri for invoking correct handler
            HttpContext context = ((HttpApplication)sender).Context;

            if (context.Request.RawUrl.Contains(".bspx")) 
            {
                string url = context.Request.RawUrl.Replace(".bspx", ".aspx");
                context.RewritePath(url);
            }
        }

        void context_PreRequestHandlerExecute(object sender, EventArgs e)
        {
            //We set back the original url on browser
            HttpContext context = ((HttpApplication)sender).Context;

            if (context.Items["originalUrl"] != null)
            {
                context.RewritePath((string)context.Items["originalUrl"]);
            }
        }

        void context_EndRequest(object sender, EventArgs e)
        {
            //We processed the request
        }

        void context_BeginRequest(object sender, EventArgs e)
        {
            //We received a request, so we save the original URL here
            HttpContext context = ((HttpApplication)sender).Context;

            if (context.Request.RawUrl.Contains(".bspx"))
            {
                context.Items["originalUrl"] = context.Request.RawUrl;
            }
        }
    }
}