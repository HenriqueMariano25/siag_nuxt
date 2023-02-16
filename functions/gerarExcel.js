import {Workbook} from "exceljs";
import * as fs from "file-saver";
import dayjs from "dayjs"
export default function gerarExcel(cabecalho, itens, nomeArquivo) {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet(nomeArquivo, {
            views: [{ state: "frozen", ySplit: 1 }],
        });
        worksheet.addRow(cabecalho);
        worksheet.autoFilter = "A1:I1";

        worksheet.eachRow(function (row, rowNumber) {
            row.eachCell((cell) => {
                if (rowNumber == 1) {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "f5b914" },
                    };
                    cell.style = { font: { bold: true, size: 14 } };
                }
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
            row.commit();
        });

        for (let item of itens) {
            worksheet.addRow(item);
        }
        let fname = nomeArquivo;

        worksheet.columns.forEach(function (column) {
            var dataMax = 0;
            column.eachCell({ includeEmpty: true }, function (cell) {
                if (cell.value) var columnLength = cell.value.length;
                if (columnLength > dataMax) {
                    dataMax = columnLength;
                }
            });
            column.width = dataMax < 12 ? 12 : dataMax;
        });
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            fs.saveAs(
                blob,
                fname + "-" + dayjs().format("DD_MM_YYYY") + ".xlsx"
            );
        });
}
