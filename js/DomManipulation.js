import RecordsManager from "./RecordsManager";

/**
 * @todo Debo agregar métodos para formatear las entradas a medida que se ingresan, por ejemplo, aplicar capitalizaciones a la entrada de producto o formato de moneda a la entrada de valor unitario, este último sin que se modifique internamente el valor o asegurandome de que se pase el valor adecuado.
 */
export default class DomManipulator {
    /**
     * 
     * @param {Document} document 
     */
    constructor(document) {
        this.document = document;
    }

    /**
     * 
     * @param {[{date: Date, product: string, amount: integer, unitPrice: float, totalPrice: float}]} records 
     * @requires RecordManager
     * @todo Refactorizar para evitar sobrecargar de responsabilidades. Ejemplo, operaciones de recarga dentro de la asignación de los eventos onclick
     */
    reloadList(records) {
        const list = this.document.getElementById('list');
        list.innerHTML = '';

        for (let record of records) {
            const listItem = this.document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.id = record.date;
            listItem.innerHTML = `<strong>${record.date}</strong> - ${record.product} - Cantidad: ${record.amount} - Valor Unitario: $${record.unitPrice} - Total: $${record.totalPrice} <button class="btn btn-sm float-right" id="deleteRecordBtn_${record.date}"><img src="src/trash_can.svg" alt="Delete" width="24" height="24"></button><button class="btn btn-sm float-right" id="recordFromListItemToUpdateFormBtn_${record.date}"><img src="src/pencil.svg" alt="Update" width="24" height="24"></button>`;
            list.appendChild(listItem);

            this.document.getElementById(`deleteRecordBtn_${record.date}`).onclick = () => {
                const self = this;
                new RecordsManager().deleteRecord(record.date, (response) => {
                    if (!response.success) {
                        alert('Error: la solicitud de eliminación no se completó con éxito. Revise la consola para más detalles.');
                    }

                    
                    new RecordsManager().recordsCharger(record.date, (response) => {
                        if (!response.success) {
                            alert('Error: nos se ha podido recuperar los datos. Revise la consola para más detalles.');
                            return;
                        }

                        self.reloadList(response.records);
                    });
                });
            };

            this.document.getElementById(`recordFromListItemToUpdateFormBtn_${record.date}`).onclick = () => {
                this.recordFromListItemToUpdateForm(date, records);
            };
        }

        // Ordenar los registros por fecha de forma ascendente
        records.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setTotalSales(records) {
        records.forEach(record => {
            if (!record.hasOwnProperty('totalPrice')) {
                record.totalPrice = record.amount * record.unitPrice;
            }
        });

        this.document.getElementById('totalSales').textContent = `$${records.reduce((total, record) => total + record.totalPrice, 0)}`;
    }

    cleanForm() {
        this.document.getElementById('product').value = '';
        this.document.getElementById('amount').value = 0;
        this.document.getElementById('unitPrice').value = 0;
    }

    /**
     * 
     * @param {string} date 
     * @param {[{date: Date, product: string, amount: integer, unitPrice: float, totalPrice: float}]} records 
     */
    recordFromListItemToUpdateForm(date, records) {
        const listItem = this.document.getElementById(date);
        const record = records.find(record => record.date === date);

        if (record != undefined) {
            listItem.innerHTML = `
            <form class="form-inline">
                <div class="form-group mx-sm-3 mb-2">
                    <input type="text" class="form-control" id="product_${record.date}" value="${record.product}">
                </div>
                <div class="form-group mx-sm-3 mb-2">
                    <input type="number" class="form-control" id="amount_${record.date}" value="${record.amount}">
                </div>
                <div class="form-group mx-sm-3 mb-2">
                    <input type="number" class="form-control" id="unitPrice_${record.date}" value="${record.unitPrice}">
                </div>
                <button type="submit" class="btn btn-primary mb-2" id="updateRecordBtn_${record.date}">Actualizar</button>
            </form>
            `;
            const self = this;
            this.document.getElementById(`updateRecordBtn_${record.date}`).onclick = () => {
                var dateAsFilter = date;
                var product = self.document.getElementById(`product_${record.date}`).value;
                var amount = parseInt(self.document.getElementById(`amount_${record.date}`).value);
                var unitPrice = parseFloat(self.document.getElementById(`unitPrice_${record.date}`).value);

                new RecordsManager().updateRecord(dateAsFilter, product, amount, unitPrice, (response) => {
                    if (!response.success) {
                        alert('Error: la solicitud de edición no se completó con éxito. Revise la consola para más detalles.');
                    }

                    new RecordsManager().recordsCharger(record.date, (response) => {
                        if (!response.success) {
                            alert('Error: nos se ha podido recuperar los datos. Revise la consola para más detalles.');
                            return;
                        }

                        self.reloadList(response.records);
                    });
                });
            };
        }
    }

}