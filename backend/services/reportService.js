import { v4 as uuidv4 } from 'uuid';
import * as reportRepository from '../repositories/reportRepository.js';
import * as productRepository from '../repositories/productRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import Report from '../models/report.js';

export const createReport = (reportData, reporterId) => {
    const { razlog, productId } = reportData;

    if (!razlog || razlog.trim() === '') {
        throw new Error("Razlog prijave je obavezan.");
    }
    const product = productRepository.default.getProductById(productId);
    if (!product) {
        throw new Error("Proizvod nije pronađen.");
    }
    if (String(product.kupacId) !== String(reporterId)) {
        throw new Error("Možete prijaviti samo prodavca od kojeg ste kupili proizvod.");
    }
    
    const newReport = new Report(
        uuidv4(),
        razlog,
        productId,
        reporterId,
        product.prodavacId, 
        new Date().toISOString(),
        "Podneta" 
    );

    return reportRepository.save(newReport);
};

export const getAllReports = () => {
    const reports = reportRepository.findAll();
    const users = userRepository.findAll(); 

    const usersMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});

    const populatedReports = reports.map(report => {
        const reporter = usersMap[report.reporterId];
        const reported = usersMap[report.reportedId];

        return {
            ...report, 
            reporterUsername: reporter ? reporter.korisnickoIme : 'Nepoznat Korisnik',
            reportedUsername: reported ? reported.korisnickoIme : 'Nepoznat Korisnik'
        };
    });

    return populatedReports;
};

export const acceptReport = (reportId) => {
    const report = reportRepository.findById(reportId); 
    if (!report) {
        throw new Error("Prijava nije pronađena.");
    }
    if (report.status !== 'Podneta') {
        throw new Error("Ova prijava je već obrađena.");
    }

    const userToBlock = userRepository.findById(report.reportedId);
    if (userToBlock) {
        userToBlock.blokiran = true;
        userRepository.save(userToBlock);
    }

    const allProducts = productRepository.default.getAllProducts();
    const updatedProducts = allProducts.map(p => {
        if (String(p.prodavacId) === String(report.reportedId) && p.status === 'Active') {
            return { ...p, status: 'DeletedByAdmin' }; 
        }
        return p;
    });
    productRepository.default.saveProducts(updatedProducts); 

    report.status = 'Prihvaćena';
    return reportRepository.save(report);
};

export const rejectReport = (reportId, reason) => {
    const report = reportRepository.findById(reportId); 
    if (!report) {
        throw new Error("Prijava nije pronađena.");
    }
    if (report.status !== 'Podneta') {
        throw new Error("Ova prijava je već obrađena.");
    }
    
    report.status = 'Odbijena';
    report.rejectionReason = reason; 
    return reportRepository.save(report);
};