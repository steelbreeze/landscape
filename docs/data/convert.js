const fs = require('fs');

const applications = JSON.parse(fs.readFileSync('./mythicalBank.json').toString());
let csv = 'id,name,capability,product,location,commissioned,decommissioned,status';

for(const application of applications) {
	for( const use of application.usage) {
		csv += `\n${application.detail.id},${application.detail.name},${use.dimensions.capability},${use.dimensions.product},${use.dimensions.location},${use.commissioned ? new Date(use.commissioned):undefined},${use.decommissioned?new Date(use.decommissioned):undefined},${use.status}`;
	}
}

console.log(csv);

fs.writeFileSync('./mythicalBank.csv', csv);