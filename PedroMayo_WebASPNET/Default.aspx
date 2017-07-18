<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PedroMayo_WebASPNET.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    
<script runat="server">
  void Page_Load(object sender, EventArgs e)
  {
    Welcome.Text = "Hello, " + Context.User.Identity.Name;
  }

  void Signout_Click(object sender, EventArgs e)
  {
    FormsAuthentication.SignOut();
    Response.Redirect("Logon.aspx");
  }
</script>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <label>Hello</label>
    <asp:Label ID="Welcome" runat="server" />
    <asp:Button ID="Submit1" OnClick="Signout_Click" Text="Sign Out" runat="server" /><p>
</asp:Content>
