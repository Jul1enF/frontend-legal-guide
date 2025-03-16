import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { RPW, RPH } from "../../../modules/dimensions"


export default function Legal() {


    const header = (
        <View style={styles.header} >
            <TouchableOpacity style={styles.headerSection} onPress={() => router.navigate(`/contact`)}>
                <FontAwesome5 name="chevron-left" color="white" size={RPW(4.2)} style={styles.icon} />
                <Text style={styles.headerText}>Contact</Text>
            </TouchableOpacity>
        </View>
    )

    const appName = "Me Baudelin"

    return (
        <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}
            stickyHeaderIndices={[0]}>

            {header}


            <Text style={styles.title}>
                Conditions générales d'utilisation de l'application {appName} :
            </Text>

            <Text style={styles.title2}>
                ARTICLE 1 : Objet
            </Text>
            <Text style={styles.text}>
                Les présentes « conditions générales d'utilisation » ont pour objet l'encadrement juridique de l’utilisation de l'application {appName} et de ses services.
            </Text><Text style={styles.text}>
                Ce contrat est conclu entre :
            </Text><Text style={styles.text}>
                Le gérant du site internet, ci-après désigné « l’Éditeur »,
            </Text><Text style={styles.text}>
                Toute personne physique ou morale souhaitant accéder au site et à ses services, ci-après appelé « l’Utilisateur ».
            </Text><Text style={styles.text}>
                Les conditions générales d'utilisation doivent être acceptées par tout Utilisateur, et son accès au site vaut acceptation de ces conditions.
            </Text>


            <Text style={styles.title3}>
                ARTICLE 2 : Mentions légales
            </Text>
            <Text style={styles.text}>
                L'application {appName} est édité par ALEXIS BAUDELIN, entreprise individuelle, dont le siège social est situé au 80 rue Réaumur, 75002 Paris.
            </Text><Text style={styles.text}>
                L'entreprise est représentée par Maitre Alexis Baudelin, avocat au barreau de Paris.
            </Text>


            <Text style={styles.title3}>
                ARTICLE 3 : Accès aux services
            </Text>
            <Text style={styles.text}>
                Tout Utilisateur ayant accès à internet peut accéder gratuitement et depuis n’importe où à l'application. Les frais supportés par l’Utilisateur pour y accéder (connexion internet, matériel informatique, etc.) ne sont pas à la charge de l’Éditeur.
            </Text><Text style={styles.text}>
                L’Utilisateur de l'application {appName} a accès aux services suivants sans création de compte :
            </Text><Text style={styles.text2}>
                - Consulter des articles de conseils juridiques et de revues de presse sur l'application {appName}.
            </Text><Text style={styles.text}>
                - Effectuer une recherche pour trouver l'un de ces articles.
            </Text><Text style={styles.text}>
                - Faire une demande de contact en urgence ou via un formulaire.
            </Text>
            <Text style={styles.text}>
                - Consulter l'agenda des évènements publics de Maître Alexis Baudelin.
            </Text>
            <Text style={styles.text}>
                La création d’un Compte se fait au moyen d’un email, d’un mot de passe, du nom de l'Utilisateur, du prénom de l'Utilisateur.
            </Text><Text style={styles.text}>
                Le Client s'engage à ne créer qu'un seul Compte correspondant à son profil.
            </Text><Text style={styles.text}>
                La création d’un compte sur l'application {appName} permet à l'utilisateur de :
            </Text><Text style={styles.text2}>
                - Ne pas avoir à renseigner ses informations déjà enregistrées lors d'une demande de contact urgent.
            </Text><Text style={styles.text2}>
                - Enregistrer ses articles favoris et les retrouver dans la rubrique "Favoris".
            </Text><Text style={styles.text}>
                - Accéder à son profil, renseigner ou modifier ses informations personnelles et de contact.
            </Text><Text style={styles.text}>
                Le site et ses différents services peuvent être interrompus ou suspendus par l’Éditeur, notamment à l’occasion d’une maintenance, sans obligation de préavis ou de justification.
            </Text>

            <Text style={styles.title3}>
                ARTICLE 4 : Responsabilité de l’Utilisateur
            </Text>
            <Text style={styles.text}>
                L'Utilisateur est responsable des risques liés à l’utilisation de son identifiant de connexion et de son mot de passe.
            </Text><Text style={styles.text}>
                Le mot de passe de l’Utilisateur doit rester secret. En cas de divulgation du mot de passe, l’Éditeur décline toute responsabilité.
            </Text><Text style={styles.text}>
                L’Utilisateur assume l’entière responsabilité de l’utilisation qu’il fait des informations et contenus présents sur l'application {appName}.
            </Text><Text style={styles.text}>
Tout usage du service par l'Utilisateur ayant directement ou indirectement pour conséquence des dommages peut voir sa responsabilité engagée et astreint à une indemnisation au profit de l'Éditeur.
            </Text>


            <Text style={styles.title3}>
                ARTICLE 5 : Responsabilité de l’Éditeur
            </Text>
            <Text style={styles.text}>
                Tout dysfonctionnement du serveur ou du réseau ne peut engager la responsabilité de l’Éditeur.
            </Text><Text style={styles.text}>
                De même, la responsabilité de l'Éditeur ne peut être engagée pour un dysfonctionnement de l'application {appName} en cas de force majeure ou du fait imprévisible et insurmontable d'un tiers.
            </Text><Text style={styles.text}>
                L'Editeur de l'application {appName} s'engage à mettre en œuvre tous les moyens nécessaires pour garantir la sécurité et la confidentialité des données. Toutefois, il n’apporte pas une garantie de sécurité totale et ne saurait garantir l'application {appName} comme un canal de mise en relation parfaitement sécurisé entre un avocat et son client. L'Éditeur conseille donc à l'Utilisateur de ne pas communiquer d'informations confidentielles via l'application {appName}.
            </Text><Text style={styles.text}>
                L’Éditeur se réserve la faculté d’une non-garantie de la fiabilité des sources, bien que les informations diffusées sur le site soient réputées fiables.
            </Text>


            <Text style={styles.title3}>
                ARTICLE 6 : Propriété intellectuelle
            </Text>
            <Text style={styles.text}>
                Les contenus de l'application {appName} (logos, textes, éléments graphiques, vidéos, etc.) sont protégés par le droit d’auteur, en vertu du Code de la propriété intellectuelle.
            </Text><Text style={styles.text}>
                L’Utilisateur devra obtenir l’autorisation de l’Éditeur du site avant toute reproduction, copie ou publication de ces différents contenus.
            </Text><Text style={styles.text}>
                Ces derniers peuvent être utilisés par les utilisateurs à des fins privées ; tout usage commercial est interdit.
            </Text>


            <Text style={styles.title3}>
                ARTICLE 7 : Données personnelles
            </Text>
            <Text style={styles.text}>
                À l'occasion de la création d'un compte, certaines données à caractère personnel sont sollicitées auprès de l'Utilisateur. Ces informations ont pour seuls destinataires les services de l'Éditeur.
            </Text><Text style={styles.text}>
                Aucune autres données (cookies, traceurs, etc.) ne sont collectées lors de l'utilisation de l'application {appName}.
            </Text><Text style={styles.text}>
                L'application {appName} garantie le respect de la vie privée de l’utilisateur, conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés.
            </Text><Text style={styles.text}>
                En vertu des articles 39 et 40 de la loi en date du 6 janvier 1978, l'Utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles. L'Utilisateur peut exercer ce droit via son espace personnel sur l'application ou par mail via l'adresse fournie dans la section "Contacts".
            </Text>


            <Text style={styles.title3}>
                ARTICLE 8 : Évolution des conditions générales d’utilisation
            </Text>
            <Text style={styles.text}>
                L'application {appName} se réserve le droit de modifier les clauses de ces conditions générales d’utilisation à tout moment et sans justification.
            </Text>


            <Text style={styles.title3}>
                ARTICLE 10 : Durée du contrat
            </Text>
            <Text style={styles.text}>
                La durée du présent contrat est indéterminée. Le contrat produit ses effets à l'égard de l'Utilisateur à compter de l'instant où il crée son compte.
            </Text>


            <Text style={styles.title3}>
                ARTICLE 11 : Droit applicable et juridiction compétente
            </Text>
            <Text style={styles.text}>
                Le présent contrat dépend de la législation française.
                En cas de litige non résolu à l’amiable entre l’Utilisateur et l’Éditeur, le tribunal judiciaire de Paris est compétent pour régler le contentieux.
            </Text>

        </ScrollView>
    )
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#fffcfc",
    },
    contentBody: {
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        paddingBottom: RPW(12),
    },
    header: {
        height: RPW(10),
        width: RPW(100),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        marginLeft: -RPW(2),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0c0000",
    },
    headerSection: {
        width: RPW(65),
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icon: {
        marginRight: RPW(3)
    },
    headerText: {
        color: "white",
        fontWeight: "500",
        fontSize: RPW(4.5)
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(6),
        fontWeight: "700",
        marginTop: RPW(6)
    },
    title2: {
        color: "#0c0000",
        fontSize: RPW(4.7),
        marginTop: RPW(8),
        fontWeight: "600",
        marginBottom : RPW(4),
    },
    text: {
        color: "#0c0000",
        fontSize: 15,
        fontWeight: "400",
        paddingBottom: 10,
    },
    title3: {
        color: "#0c0000",
        fontSize: 20,
        paddingTop: 20,
        fontWeight: "600",
        paddingBottom: 20,
    },
    text2: {
        color: "#0c0000",
        fontSize: 15,
        fontWeight: "400",
        paddingBottom: 5,
    },

})