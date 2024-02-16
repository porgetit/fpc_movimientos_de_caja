import DomManipulator from "./DomManipulation";
import RecordsManager from "./RecordsManager";

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('DOMContentLoaded', () => {
        new DomManipulator(document).whenDomContentLoadedInitProtocol();
    });
});


// Config
document.getElementById('date').addEventListener('change', () => {
    const self = document.getElementById('date');
    new RecordsManager().recordsCharger(self.value, (response) => {
        if(!response.success) {
            alert('Error: no se ha podido recuperar los datos. Revise la consola para más detalles.');
            return;
        }
        let DomManipulator = new DomManipulator(document);
        DomManipulator.reloadList(response.records);
        DomManipulator.setTotalSales(response.records);
    });
});