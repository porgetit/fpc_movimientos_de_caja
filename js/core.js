import DomManipulator from "./DomManipulation";
import RecordsManager from "./RecordsManager";

const self = {document: document};

// Initialization
self.document.addEventListener('DOMContentLoaded', function() {
    self.document.addEventListener('DOMContentLoaded', () => {
        new DomManipulator(document).whenDomContentLoadedInitProtocol();
    });
});


// Config
self.document.getElementById('date').addEventListener('change', () => {
    const self = document.getElementById('date');
    new RecordsManager().recordsCharger(self.value, (response) => {
        if(!response.success) {
            alert('Error: no se ha podido recuperar los datos. Revise la consola para más detalles.');
            return;
        }
        
        new DomManipulator(document).reloadList(response.records);
        new DomManipulator(document).setTotalSales(response.records);
    });
});