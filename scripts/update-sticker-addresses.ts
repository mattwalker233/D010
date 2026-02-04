import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OLD_ADDRESSES = [
  '2100 Ross Ave, Suite 1870, LB-9',
  '2100 Ross Ave, Suite 1870',
  '2100 ROSS AVE, SUITE 1870, LB-9',
  '2100 ROSS AVE,SUITE 1870,LB-9',
  '2100 ROSS AVE STE 1870 LB-9',
  '2100 ROSS AVE STE 1870',
  '2100 ROSS AVENUE SUITE 1870',
  '2100 ROSS AVE., SUITE 1870, LB-9',
  '2100 ROSS AVE., SUITE 1870, LB -9',
  '2100 ROSS AVE LB-9',
  '2100 ross ave#1870',
  '8200 Ross ave Suite 1870',
];

const NEW_ADDRESS = '110 Manufacturing Street Dallas, TX 75207';

async function updateStickerAddresses() {
  try {
    console.log('Starting sticker address update...');
    
    // Get all entities
    const entities = await prisma.entity.findMany();
    console.log(`Found ${entities.length} entities to check`);
    
    let updatedCount = 0;
    
    for (const entity of entities) {
      let updated = false;
      let newStickerInfo = entity.sticker_info;

      // Check each old address variation
      for (const oldAddress of OLD_ADDRESSES) {
        const regex = new RegExp(oldAddress.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (regex.test(newStickerInfo)) {
          newStickerInfo = newStickerInfo.replace(regex, NEW_ADDRESS);
          updated = true;
          console.log(`Found old address in entity ${entity.id} (${entity.entity_name})`);
        }
      }

      // Replace any address line that mentions the old location
      const lines = newStickerInfo.split(/\r?\n/);
      const updatedLines: string[] = [];
      let replacedLine = false;
      for (const line of lines) {
        if (
          /2100\s*0*\s*Ross\s+Ave/i.test(line) ||
          /8200\s+Ross\s+ave/i.test(line) ||
          /Suite\s*1870/i.test(line) ||
          /LB\s*-?\s*9/i.test(line)
        ) {
          updatedLines.push(NEW_ADDRESS);
          replacedLine = true;
          updated = true;
          continue;
        }

        // Drop old city/state line if we already include full address
        if (/^Dallas,\s*TX\s*7520[17]$/i.test(line)) {
          updated = true;
          continue;
        }

        updatedLines.push(line);
      }

      if (replacedLine) {
        newStickerInfo = updatedLines.join('\n').replace(/\n{2,}/g, '\n').trim();
      }

      if (updated) {
        await prisma.entity.update({
          where: { id: entity.id },
          data: { sticker_info: newStickerInfo }
        });
        updatedCount++;
        console.log(`Updated entity ${entity.id} (${entity.entity_name})`);
        console.log(`New sticker_info: ${newStickerInfo.substring(0, 100)}...`);
      }
    }
    
    console.log(`\nUpdate complete! Updated ${updatedCount} entities.`);
  } catch (error) {
    console.error('Error updating sticker addresses:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateStickerAddresses();
