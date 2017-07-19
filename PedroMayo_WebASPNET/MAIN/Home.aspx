<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="PedroMayo_WebASPNET.MAIN.frmMain" %>

<%@ Register Assembly="PedroMayo.Comun.Web" Namespace="PedroMayo.Comun.Web._Controls._Basics" TagPrefix="cc1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="../_js/main.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div>Homee</div>
    <asp:ListBox ID="lstUsers" runat="server" />
    <br />
    <cc1:PMDropDownList ID="PMDropDownList1" runat="server" Multiselection="true" CssClassExtra="width100percent"></cc1:PMDropDownList>
</asp:Content>
