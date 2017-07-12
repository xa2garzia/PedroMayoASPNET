<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="PedroMayo_WebASPNET.MAIN.frmMain" %>

<%@ Register TagPrefix="uc" TagName="CtrCurrentUserInfo" Src="C:\Users\xgb\Source\Repos\PedroMayoASPNET\PedroMayo.Comun.Web\_Componentes\CtrCurrentUserInfo.cs" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <uc:CtrCurrentUserInfo ID="sss"></uc:CtrCurrentUserInfo>
    <div>Homee</div>
    <asp:ListBox ID="lstUsers" runat="server" />
</asp:Content>
