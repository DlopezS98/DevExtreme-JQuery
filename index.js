/// <reference path="./dist/ts/jquery.d.ts" />
/// <reference path="./dist/ts/dx.all.d.ts" />

// $(document).ready(async function () {
//     const _dt = await GetDataSource();
//     const data = GetFinallyDataSource(_dt);
//     console.log("dt", data);
//     $("#dataGrid").dxDataGrid({
//         columns: [...data.columns],
//         dataSource: data.dt,
//     });
// });

// async function GetDataSource() {
//     return await $.getJSON("./src/CustomerCareSchedule.json",
//         function (data, textStatus, jqXHR) {
//             return data;
//         }
//     );
// }

function GetFinallyDataSource(_dt){
    const rows = [
        { displayName: "Customer Care Primary", value: "CustomerCarePrimary"}, 
        { displayName: "Customer Care Emergency", value: "CustomerCareEmergency"}, 
        { displayName: "Customer Care Anniversary", value: "CustomerCareAnniversary"}]

    const key = "Date";

    //order by asc
    _dt = _dt.sort((a, b) => new Date(a[key]) - new Date(b[key]));
    let dt_item = { SOType: "" }
    let dt = [];

    //select unique dates values and sort it...
    const dates = [...new Map(_dt.map(item => [item[key], item[key]])).values()].sort((a, b) => new Date(a) - new Date(b));

    //Create columns name (based on dates) for datasource object (SOType, October-11, October-12, ...)
    dates.forEach((e, i) => {
        const date = GetColumnName(e);
        dt_item[date] = [];
    });

    const columns = Object.keys(dt_item);

    //build final datasource and set values for each columns
    rows.forEach((row, i) => {
        dt_item.SOType = row.displayName;
        columns.forEach((col, j) => {
            const Warranties = _dt.find(x => GetColumnName(x[key]) === col)?.Warranties;
            if(Warranties)
                dt_item[col] = Warranties.filter(x => x.Type == row.value);
        });
        dt.push(Object.assign({}, dt_item));
    });
    
    //Create config for data grid columns
    let dgColumns = [];
    columns.forEach(key => {
        dgColumns.push({ 
            caption: key,
            cellTemplate: function(container, options){
                const row = options.row.data;
                if(key === "SOType"){
                    $('<h6>').html(row[key]).appendTo(container)
                } else {
                    row[key].forEach(e => {
                        if(e){
                            $('<div>').attr({
                                style: `text-align: center; color:${e.Color}`,
                            }).html(e.Value).appendTo(container)
                        }
                    });
                }
            }
        });
    });

    return { dt, columns: dgColumns };
}

function GetColumnName(date){
    return (new Date(date).toLocaleDateString('en-EN', { month: "long", day: "numeric"})).replace(' ', '-');
}