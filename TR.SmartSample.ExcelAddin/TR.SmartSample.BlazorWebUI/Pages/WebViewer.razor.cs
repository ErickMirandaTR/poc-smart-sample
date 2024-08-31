using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Versioning;
using TR.SmartSample.BlazorWebUI.Models;
using System.Net.Http.Json;

namespace TR.SmartSample.BlazorWebUI.Pages
{
    [SupportedOSPlatform("browser")]
    public partial class WebViewer 
    {
        [Inject, AllowNull]
        private IJSRuntime JSRuntime { get; set; }
        private IJSObjectReference? JSModule { get; set; }
        private bool IsLoading { get; set; } = false;
        private string? ErrorMessage { get; set; }

        [Inject, AllowNull]
        private HttpClient HttpClient { get; set; }
        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                JSModule = await JSRuntime.InvokeAsync<IJSObjectReference>("import", $"./Pages/WebViewer.razor.js?v={DateTime.Now.Ticks}");
                await JSRuntime.InvokeVoidAsync("initializeWebViewer");
                await CreateInvoiceTable();
            }
        }

        /// <summary>
        /// Function to create the starter table as source for the bubble chart.
        /// </summary>
        private async Task CreateInvoiceTable()
        {
            IsLoading = true;
            ErrorMessage = string.Empty;
            try
            {
                //https://smart-sample.free.beeceptor.com/getinventories
                //mocked-datas/inventories.json
                var data = await HttpClient.GetFromJsonAsync<List<InvoiceDetails>>($"/mocked-datas/invoices.json?v={DateTime.Now.Ticks}");
                await JSModule.InvokeVoidAsync("createInvoiceTable", data);
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error occurred while fetching data. Details: {ex.Message}";
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}
