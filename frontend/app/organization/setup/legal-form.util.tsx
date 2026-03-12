import {ComAccountingDatabaseOrganizationLegalForm} from "@/app/generated/api";
import {Building2, Shirt, Store, User, Users} from "lucide-react";

export type LegalForm = typeof ComAccountingDatabaseOrganizationLegalForm[keyof typeof ComAccountingDatabaseOrganizationLegalForm];
export const LegalForm = ComAccountingDatabaseOrganizationLegalForm;
export const legalForms = Object.values(LegalForm) as Array<LegalForm>

/**
 * Convert a legal form to a title.
 * @param legalForm The legal form to convert.
 * @returns The title of the legal form.
 */
export function legalFormToTitle(legalForm: LegalForm) {
    switch (legalForm) {
        case LegalForm.SelfEmployed:
            return 'I am self-employed'
        case LegalForm.Partnership:
            return 'I have a partnership'
        case LegalForm.Association:
            return 'I have an association'
        case LegalForm.LimitedLiabilityCompany:
            return 'I have a limited liability company (LLC)'
        case LegalForm.LimitedCompany:
            return 'I have a limited company (Ltd.)'
    }
}

/**
 * Convert a legal form to a text.
 * @param legalForm The legal form to convert.
 * @returns The text of the legal form.
 */
export function legalFormToText(legalForm: LegalForm) {
    switch (legalForm) {
        case LegalForm.SelfEmployed:
            return 'For when you are self-employed and did not found any other legal entity.'
        case LegalForm.Partnership:
            return 'For when you have founded a partnership with another person.'
        case LegalForm.Association:
            return 'For when you are organized as an association.'
        case LegalForm.LimitedLiabilityCompany:
            return 'For when you have founded a company with limited liability.'
        case LegalForm.LimitedCompany:
            return 'For when you have founded a limited company.'
    }
}

/**
 * Convert a legal form to an icon.
 * @param legalForm The legal form to convert.
 * @returns The icon of the legal form.
 */
export function legalFormToIcon(legalForm: LegalForm) {
    switch (legalForm) {
        case LegalForm.SelfEmployed:
            return <User/>
        case LegalForm.Partnership:
            return <Users/>
        case LegalForm.Association:
            return <Shirt/>
        case LegalForm.LimitedLiabilityCompany:
            return <Store/>
        case LegalForm.LimitedCompany:
            return <Building2/>
    }
}