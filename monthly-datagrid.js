$(document).ready(async function () {
    const data = await GetDataSource();
    // const data = MonthlyDataSource(_dt);
    console.log("_dt", data);
    $("#dataGrid").dxDataGrid({
        columns: [
            {
                dataField: "Week",
                caption: "Weeks"
            }
        ],
        dataSource: data,
        masterDetail: {
            enabled: true,
            template: function(container, options) {
                const dt = GetFinallyDataSource(options.data.Days);
                
                $("<div>").dxDataGrid({
                    columns: [...dt.columns],
                    dataSource: dt.dt
                }).appendTo(container);
            }
        }
    });
});

// function MonthlyDataSource(_dt){
//     GetFinallyDataSource(_dt);
// }

async function GetDataSource() {
    return await $.getJSON("./src/MonthlyCustomerCare.json",
        function (data, textStatus, jqXHR) {
            return data;
        }
    );
}