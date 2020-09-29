const fs = require('fs');

const applications = JSON.parse(fs.readFileSync('./mythicalBank.json').toString());
let csv = 'name,supplier,capability,product,location,commissioned,decommissioned,status';

for (const application of applications) {
	for (const use of application.usage) {
		csv += `\r\n${application.detail.name},${application.detail.supplier},${use.dimensions.capability},${use.dimensions.product},${use.dimensions.location},${use.commissioned ? new Date(use.commissioned) : ''},${use.decommissioned ? new Date(use.decommissioned) : ''},${use.status}`;
	}
}

fs.writeFileSync('./mythicalBank.csv', csv);