"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const mongoose_1 = require("mongoose");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const governorate_model_js_1 = require("../DB/models/governorate.model.js");
const user_model_js_1 = require("../DB/models/user.model.js");
const user_types_js_1 = require("../modules/userModule/user.types.js");
(0, dotenv_1.config)();
const EMAIL_DOMAIN = 'ylyUnion.com';
const accountSeeds = [
    { label: 'Cairo', emailLocal: 'cairo', assignedGovernorate: 'Cairo' },
    { label: 'Giza', emailLocal: 'giza', assignedGovernorate: 'Giza' },
    { label: 'Aswan', emailLocal: 'aswan', assignedGovernorate: 'Aswan' },
    { label: 'Luxor', emailLocal: 'luxor', assignedGovernorate: 'Luxor' },
    { label: 'New Valley', emailLocal: 'newvalley', assignedGovernorate: 'New Valley' },
    { label: 'Qena', emailLocal: 'qena', assignedGovernorate: 'Qena' },
    { label: 'Sohag', emailLocal: 'sohag', assignedGovernorate: 'Sohag' },
    { label: 'Assuit', emailLocal: 'assuit', assignedGovernorate: 'Assuit' },
    { label: 'Minya', emailLocal: 'minya', assignedGovernorate: 'Minya' },
    { label: 'Fayoum', emailLocal: 'fayoum', assignedGovernorate: 'Fayoum' },
    { label: 'Beni Seif', emailLocal: 'beniseif', assignedGovernorate: 'Beni Seif' },
    { label: 'Qalyobia', emailLocal: 'qalyobia', assignedGovernorate: 'Qalyobia' },
    { label: 'Menofia', emailLocal: 'menofia', assignedGovernorate: 'Menofia' },
    { label: 'Gharbia', emailLocal: 'gharbia', assignedGovernorate: 'Gharbia' },
    { label: 'Sharqia', emailLocal: 'sharqia', assignedGovernorate: 'Sharqia' },
    { label: 'Dakahlia', emailLocal: 'dakahlia', assignedGovernorate: 'Dakahlia' },
    { label: 'Kafr Elsheikh', emailLocal: 'kafrelsheikh', assignedGovernorate: 'Kafr Elsheikh' },
    { label: 'Beheira', emailLocal: 'beheira', assignedGovernorate: 'Beheira' },
    { label: 'Suez', emailLocal: 'suez', assignedGovernorate: 'Suez' },
    { label: 'Ismailya', emailLocal: 'ismailya', assignedGovernorate: 'Ismailya' },
    { label: 'PortSaid', emailLocal: 'portsaid', assignedGovernorate: 'PortSaid' },
    { label: 'Demitta', emailLocal: 'demitta', assignedGovernorate: 'Demitta' },
    { label: 'Alexandrra', emailLocal: 'alexandrra', assignedGovernorate: 'Alexandrra' },
    { label: 'Matrouh', emailLocal: 'matrouh', assignedGovernorate: 'Matrouh' },
    { label: 'North Sinai', emailLocal: 'northsinai', assignedGovernorate: 'North Sinai' },
    { label: 'South sinai', emailLocal: 'southsinai', assignedGovernorate: 'South sinai' },
    { label: 'Red Sea', emailLocal: 'redsea', assignedGovernorate: 'Red Sea' },
    { label: 'Ministry Team', emailLocal: 'ministryteam', assignedGovernorate: 'Cairo' },
    { label: 'Capital Team', emailLocal: 'capitalteam', assignedGovernorate: 'Cairo' },
    { label: '7G Team', emailLocal: '7gteam', assignedGovernorate: 'Cairo' },
    { label: 'Gen-Y Team', emailLocal: 'gen-yteam', assignedGovernorate: 'Cairo' },
];
const buildEmail = (emailLocal) => `${emailLocal}@${EMAIL_DOMAIN}`.toLowerCase();
const randomFourDigits = () => Math.floor(1000 + Math.random() * 9000).toString();
const ensureGovernorates = async () => {
    const governorateNames = [...new Set(accountSeeds.map((entry) => entry.assignedGovernorate))];
    const governorateIdByName = new Map();
    for (const governorateName of governorateNames) {
        let governorate = await governorate_model_js_1.GovernorateModel.findOne({ name: governorateName });
        if (!governorate) {
            governorate = await governorate_model_js_1.GovernorateModel.create({
                name: governorateName,
                arabicName: governorateName,
                description: `Auto-created governorate record for ${governorateName}`,
                arabicDescription: `Auto-created governorate record for ${governorateName}`,
            });
            console.log(`Governorate created: ${governorateName}`);
        }
        else {
            console.log(`Governorate exists: ${governorateName}`);
        }
        governorateIdByName.set(governorateName, governorate._id.toString());
    }
    return governorateIdByName;
};
const escapeCsvCell = (value) => `"${value.replace(/"/g, '""')}"`;
const writeSheetCsv = (rows) => {
    const outputPath = node_path_1.default.resolve(process.cwd(), 'governorate-manager-accounts.csv');
    const header = ['account_name', 'email', 'password', 'assigned_governorate', 'status'];
    const lines = [header.join(',')];
    for (const row of rows) {
        lines.push([
            escapeCsvCell(row.accountName),
            escapeCsvCell(row.email),
            escapeCsvCell(row.password),
            escapeCsvCell(row.governorate),
            escapeCsvCell(row.status),
        ].join(','));
    }
    node_fs_1.default.writeFileSync(outputPath, lines.join('\n'), 'utf8');
    return outputPath;
};
const run = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing in environment variables.');
    }
    await (0, mongoose_1.connect)(mongoUri);
    const governorateIdByName = await ensureGovernorates();
    const resultRows = [];
    for (const entry of accountSeeds) {
        const email = buildEmail(entry.emailLocal);
        const password = `${entry.emailLocal.toLowerCase()}+${randomFourDigits()}`;
        const governorateId = governorateIdByName.get(entry.assignedGovernorate);
        if (!governorateId) {
            throw new Error(`Governorate not found in map: ${entry.assignedGovernorate}`);
        }
        const existingUser = await user_model_js_1.UserModel.findOne({ email });
        if (!existingUser) {
            await user_model_js_1.UserModel.create({
                email,
                password,
                role: user_types_js_1.RoleEnum.user,
                governorateId,
                isActive: true,
                deletedAt: null,
                refreshToken: null,
            });
            resultRows.push({
                accountName: entry.label,
                email,
                password,
                governorate: entry.assignedGovernorate,
                status: 'created',
            });
            console.log(`User created: ${email} -> ${entry.assignedGovernorate}`);
            continue;
        }
        existingUser.password = password;
        existingUser.role = user_types_js_1.RoleEnum.user;
        existingUser.governorateId = governorateId;
        existingUser.isActive = true;
        existingUser.deletedAt = null;
        existingUser.refreshToken = null;
        await existingUser.save();
        resultRows.push({
            accountName: entry.label,
            email,
            password,
            governorate: entry.assignedGovernorate,
            status: 'updated',
        });
        console.log(`User updated: ${email} -> ${entry.assignedGovernorate}`);
    }
    const sheetPath = writeSheetCsv(resultRows);
    console.log(`Done. Accounts sheet generated: ${sheetPath}`);
};
run()
    .catch((error) => {
    console.error('Failed to seed governorate accounts:', error);
    process.exitCode = 1;
})
    .finally(async () => {
    await (0, mongoose_1.disconnect)();
});
//# sourceMappingURL=seed-governorate-accounts.js.map