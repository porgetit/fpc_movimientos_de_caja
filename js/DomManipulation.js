import RecordsManager from "./RecordsManager";
import FormValidator from "./FormValidation";

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
        const list = this.document.getElementById('recordsList');
        
        if (list === null) {
            console.log(`Error: el elemento list: ${typeof(list)}.`);
            return;
        }

        this.cleanElement(list);

        // Ordenar los registros por fecha de forma ascendente antes de mostrarlos por pantalla
        records.sort((a, b) => new Date(a.date) - new Date(b.date));

        for (let record of records) {
            const listItem = this.document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.id = record.date;
            listItem.innerHTML = `<strong>${record.date}</strong> - ${record.product} - Cantidad: ${record.amount} - Valor Unitario: $${record.unitPrice} - Total: $${record.totalPrice} <button class="btn btn-sm float-right" id="deleteRecordBtn_${record.date}"><img src="src/trash_can.svg" alt="Delete" width="24" height="24"></button><button class="btn btn-sm float-right" id="recordFromListItemToUpdateFormBtn_${record.date}"><img src="src/pencil.svg" alt="Update" width="24" height="24"></button>`;
            list.appendChild(listItem);

            this.document.getElementById(`deleteRecordBtn_${record.date}`).onclick = () => {
                const self = {this: this, list: list};
                new RecordsManager().deleteRecord(record.date, (response) => {
                    if (!response.success) {
                        alert('Error: la solicitud de eliminación no se completó con éxito. Revise la consola para más detalles.');
                    }

                    
                    new RecordsManager().recordsCharger(record.date, (response) => {
                        if (!response.success) {
                            alert('Error: nos se han podido recuperar los datos. Revise la consola para más detalles.');
                            self.list.innerHTML = '';
                            // Hay que hacer que se borre la lista cuando no hayan registros
                            return;
                        }

                        if (!response.records.length > 0) {
                            alert('Error: no hay datos para la fecha especificada.');
                            self.cleanElement(self.list);
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
    }

    cleanElement(element) {
        element.innerHTML = '';
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

    whenDomContentLoadedInitProtocol() {
        /**
         * Primero, agregamos el evento onclick al elemento addRecordBtn del formulario principal
         */
        this.document.getElementById('addRecordBtn').onclick = () => {
            var product = this.document.getElementById('product').value;
            var amount = this.document.getElementById('amount').value;
            var unitPrice = this.document.getElementById('unitPrice').value;

            if (!new FormValidator().validateForm(product, amount, unitPrice)) {
                alert('Error de validación, por favor verifique los datos ingresados.');
            } else {
                let RecordsManager = new RecordsManager();

                RecordsManager.addRecord(product, amount, unitPrice, (response) => {
                    if (!response.success) {
                        alert('Error: la solicitud de inserición no se completó con éxito. Revise la consola para más detalles.');
                    }

                    RecordsManager.recordsCharger(this.document.getElementById('date').value, (response) => {
                        if (!response.success) {
                            alert('Error: no se ha podido recuperar los datos. Revise la consola para más detalles.');
                            return;
                        }
            
                        this.reloadList(response.records);
                    });

                    this.setTotalSales(response.records);

                    this.cleanForm();

                });
            }
        };
        
        /**
         * Segundo, cargamos los registros desde la base de datos
         */

        new RecordsManager().recordsCharger(this.document.getElementById('date').value, (response) => {
            if (!response.success) {
                alert('Error: no se ha podido recuperar los datos. Revise la consola para más detalles.');
                return;
            }

            this.reloadList(response.records);
        });

        /**
         * Tercero, modificamos el contenido del elemento copyright del footer
         */
        var year = new Date().getFullYear();
        document.getElementById('copyright').innerHTML = `© ${year} Copyright:
        <a class="text-dark" href="https://kevinesguerracardona.com/">Kevin Esguerra Cardona</a>`;
    }

}