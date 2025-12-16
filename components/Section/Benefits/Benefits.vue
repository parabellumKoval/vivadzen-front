<script setup>
const {t} = useI18n()
const props = defineProps({})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./benefits.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
<section class="benefits-section">
    <div class="benefits-container">
        <h2 class="benefits-title">Proč nakupovat u nás?</h2>
        <p class="benefits-subtitle">Získejte maximum ze svých nákupů s našimi výhodami</p>
        
        <div class="benefits-grid">
            <!-- Benefit 1: Free Shipping -->
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 3h5v5"></path>
                        <path d="M8 3H3v5"></path>
                        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"></path>
                        <path d="m15 9 6-6"></path>
                        <path d="M9 18h6"></path>
                        <circle cx="9" cy="18" r="2"></circle>
                        <circle cx="15" cy="18" r="2"></circle>
                    </svg>
                </div>
                <h3 class="benefit-title">Doprava zdarma</h3>
                <p class="benefit-description">Při nákupu nad 2000 Kč si užijete dopravu zcela zdarma až k vám domů</p>
            </div>

            <!-- Benefit 2: Personal Discounts -->
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <h3 class="benefit-title">Osobní slevy</h3>
                <p class="benefit-description">Pravidelní zákazníci získávají exkluzivní osobní slevy a speciální nabídky</p>
            </div>

            <!-- Benefit 3: Promo Codes -->
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                        <path d="m9 11 3 3L22 4"></path>
                    </svg>
                </div>
                <h3 class="benefit-title">Slevové kódy</h3>
                <p class="benefit-description">Využijte naše promo kódy a získejte další slevy na své oblíbené produkty</p>
            </div>

            <!-- Benefit 4: Vivapoints for Reviews -->
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
                <h3 class="benefit-title">Vivapoints za recenze</h3>
                <p class="benefit-description">Napište recenzi produktu a získejte vivapoints, které můžete využít při příštím nákupu</p>
            </div>

            <!-- Benefit 5: Referral System -->
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <h3 class="benefit-title">Třístupňový referral systém</h3>
                <p class="benefit-description">Doporučte nás přátelům a získejte odměny až ze tří úrovní doporučení</p>
            </div>

            <!-- Benefit 6: Pay with Bonuses -->
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                        <line x1="2" x2="22" y1="10" y2="10"></line>
                    </svg>
                </div>
                <h3 class="benefit-title">Platba bonusy</h3>
                <p class="benefit-description">Plaťte své objednávky získanými bonusy a ušetřete na každém nákupu</p>
            </div>

            <!-- Benefit 7: Withdraw to Card -->
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                    </svg>
                </div>
                <h3 class="benefit-title">Výběr na kartu</h3>
                <p class="benefit-description">Vivapoints můžete jednoduše vybrat přímo na svou platební kartu</p>
            </div>
        </div>
    </div>
</section>
</template>