/**
 * VTB Setup Script (EOAP)
 *
 * This script generates the instructions or can be extended to create
 * Visual Task Board records via ServiceNow REST / now-sdk.
 *
 * Run: npx ts-node agents/vtb-setup.ts
 */

console.log('=== EOAP Visual Task Board Setup ===\n');

console.log('1. Na PDI, crie um novo Visual Task Board:');
console.log('   - Type: Scrum (Agile)');
console.log('   - Name: EOAP MVP Sprint Board');
console.log('   - Lanes: To Do | In Progress | Review | Done | Blocked\n');

console.log('2. Importe as Stories do backlog (docs/02-Product-Management/Stories/).');
console.log('3. Vincule cada cartão à respectiva Story (STORY-XXX).\n');

console.log('Recomendação futura: Integrar com VTBAgent para criação automática via API.');
