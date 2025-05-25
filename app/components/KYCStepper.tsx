"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Typography,
    InputLabel,
} from "@mui/material";

type PersonalInfo = {
    fullName: string;
    birthDate: string;
    address: string;
    nationality: string;
    email: string;
};

type Documents = {
    identityFile?: File;
    proofOfAddressFile?: File;
};

const steps = [
    "Informations personnelles",
    "Téléversement des documents",
    "Résumé & soumission",
];

export default function KYCStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        fullName: "",
        birthDate: "",
        address: "",
        nationality: "",
        email: "",
    });

    const [documents, setDocuments] = useState<Documents>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePersonalInfoChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setPersonalInfo({
            ...personalInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (!file) return;

        if (e.target.name === "identityFile") {
            setDocuments((prev) => ({ ...prev, identityFile: file }));
        } else if (e.target.name === "proofOfAddressFile") {
            setDocuments((prev) => ({ ...prev, proofOfAddressFile: file }));
        }
    };

    const handleNext = () => {
        // validation simple
        if (activeStep === 0) {
            if (
                !personalInfo.fullName ||
                !personalInfo.birthDate ||
                !personalInfo.address ||
                !personalInfo.nationality ||
                !personalInfo.email
            ) {
                alert("Veuillez remplir tous les champs.");
                return;
            }
        }
        if (activeStep === 1) {
            if (!documents.identityFile || !documents.proofOfAddressFile) {
                alert("Veuillez téléverser tous les documents demandés.");
                return;
            }
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // TODO: envoi des données au backend

        alert("Données soumises avec succès !");
        setIsSubmitting(false);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && (
                <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Nom complet"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handlePersonalInfoChange}
                        required
                    />
                    <TextField
                        label="Date de naissance"
                        name="birthDate"
                        type="date"
                        value={personalInfo.birthDate}
                        onChange={handlePersonalInfoChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="Adresse"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                        required
                    />
                    <TextField
                        label="Nationalité"
                        name="nationality"
                        value={personalInfo.nationality}
                        onChange={handlePersonalInfoChange}
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        required
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button variant="contained" onClick={handleNext}>
                            Suivant
                        </Button>
                    </Box>
                </Box>
            )}

            {activeStep === 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                        <InputLabel htmlFor="identityFile">Pièce d'identité (CNI, passeport, etc.)</InputLabel>
                        <input
                            type="file"
                            id="identityFile"
                            name="identityFile"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange}
                            aria-label="Pièce d'identité (CNI, passeport, etc.)"
                            title="Pièce d'identité (CNI, passeport, etc.)"
                        />

                        {documents.identityFile && (
                            <Typography variant="body2" mt={1}>
                                Fichier choisi: {documents.identityFile.name}
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <InputLabel htmlFor="proofOfAddressFile">Justificatif de domicile (facture, quittance, etc.)</InputLabel>
                        <input
                            type="file"
                            id="proofOfAddressFile"
                            name="proofOfAddressFile"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange}
                            aria-label="Justificatif de domicile (facture, quittance, etc.)"
                            title="Justificatif de domicile (facture, quittance, etc.)"
                        />

                        {documents.proofOfAddressFile && (
                            <Typography variant="body2" mt={1}>
                                Fichier choisi: {documents.proofOfAddressFile.name}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                        <Button variant="outlined" onClick={handleBack}>
                            Précédent
                        </Button>
                        <Button variant="contained" onClick={handleNext}>
                            Suivant
                        </Button>
                    </Box>
                </Box>
            )}

            {activeStep === 2 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Résumé des informations
                    </Typography>
                    <Typography><strong>Nom complet :</strong> {personalInfo.fullName}</Typography>
                    <Typography><strong>Date de naissance :</strong> {personalInfo.birthDate}</Typography>
                    <Typography><strong>Adresse :</strong> {personalInfo.address}</Typography>
                    <Typography><strong>Nationalité :</strong> {personalInfo.nationality}</Typography>
                    <Typography><strong>Email :</strong> {personalInfo.email}</Typography>

                    <Typography mt={2} variant="h6" gutterBottom>
                        Documents téléversés
                    </Typography>
                    <Typography><strong>Pièce d'identité :</strong> {documents.identityFile?.name || "Non téléversé"}</Typography>
                    <Typography><strong>Justificatif de domicile :</strong> {documents.proofOfAddressFile?.name || "Non téléversé"}</Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                        <Button variant="outlined" onClick={handleBack} disabled={isSubmitting}>
                            Précédent
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Envoi en cours..." : "Confirmer et envoyer"}
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
