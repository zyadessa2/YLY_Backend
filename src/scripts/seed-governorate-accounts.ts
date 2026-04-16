import { config } from 'dotenv';
import { connect, disconnect } from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { GovernorateModel } from '../DB/models/governorate.model.js';
import { UserModel } from '../DB/models/user.model.js';
import { RoleEnum } from '../modules/userModule/user.types.js';

type AccountSeed = {
    label: string;
    emailLocal: string;
    assignedGovernorate: string;
};

type ResultRow = {
    accountName: string;
    email: string;
    password: string;
    governorate: string;
    status: 'created' | 'updated';
};

config();

const EMAIL_DOMAIN = 'ylyUnion.com';

const accountSeeds: AccountSeed[] = [
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

const buildEmail = (emailLocal: string): string => `${emailLocal}@${EMAIL_DOMAIN}`.toLowerCase();

const randomFourDigits = (): string => Math.floor(1000 + Math.random() * 9000).toString();

const ensureGovernorates = async (): Promise<Map<string, string>> => {
    const governorateNames = [...new Set(accountSeeds.map((entry) => entry.assignedGovernorate))];
    const governorateIdByName = new Map<string, string>();

    for (const governorateName of governorateNames) {
        let governorate = await GovernorateModel.findOne({ name: governorateName });

        if (!governorate) {
            governorate = await GovernorateModel.create({
                name: governorateName,
                arabicName: governorateName,
                description: `Auto-created governorate record for ${governorateName}`,
                arabicDescription: `Auto-created governorate record for ${governorateName}`,
            });
            console.log(`Governorate created: ${governorateName}`);
        } else {
            console.log(`Governorate exists: ${governorateName}`);
        }

        governorateIdByName.set(governorateName, governorate._id.toString());
    }

    return governorateIdByName;
};

const escapeCsvCell = (value: string): string => `"${value.replace(/"/g, '""')}"`;

const writeSheetCsv = (rows: ResultRow[]): string => {
    const outputPath = path.resolve(process.cwd(), 'governorate-manager-accounts.csv');
    const header = ['account_name', 'email', 'password', 'assigned_governorate', 'status'];
    const lines = [header.join(',')];

    for (const row of rows) {
        lines.push(
            [
                escapeCsvCell(row.accountName),
                escapeCsvCell(row.email),
                escapeCsvCell(row.password),
                escapeCsvCell(row.governorate),
                escapeCsvCell(row.status),
            ].join(',')
        );
    }

    fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
    return outputPath;
};

const run = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing in environment variables.');
    }

    await connect(mongoUri);

    const governorateIdByName = await ensureGovernorates();
    const resultRows: ResultRow[] = [];

    for (const entry of accountSeeds) {
        const email = buildEmail(entry.emailLocal);
        const password = `${entry.emailLocal.toLowerCase()}+${randomFourDigits()}`;
        const governorateId = governorateIdByName.get(entry.assignedGovernorate);

        if (!governorateId) {
            throw new Error(`Governorate not found in map: ${entry.assignedGovernorate}`);
        }

        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            await UserModel.create({
                email,
                password,
                role: RoleEnum.user,
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
        existingUser.role = RoleEnum.user;
        existingUser.governorateId = governorateId as any;
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
        await disconnect();
    });
