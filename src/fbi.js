import { server } from "./veduz/veduz.mjs";

let currentAgency = "";
let bearer = server.fbiToken(currentAgency);

async function fbi(query, variables, {token, searchProfile} = {}) {
  if(!token) token = await bearer;
  if(!searchProfile) searchProfile = "default";
  let result = await (
    await fetch(`https://fbi-api.dbc.dk/${searchProfile}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + token,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  ).json();
  return result.data || result;
}
export async function suggest(q) {
  return fbi(
    `
    query Example_Suggestions($q: String!, $suggestTypes: [SuggestionType!]) {
        suggest(q: $q, suggestTypes: $suggestTypes) {
          result {
            term
            type
            work { 
              manifestations { 
                bestRepresentation {
                  creators { display }
                  titles { full }
                  cover { detail }
                  pid
                }
              } 
            } 
          }
        }
      }
    `,
    { q },
  );
}

async function work(pid = "870970-basis:48953786") {
  return fbi(
    `
        query ($pid: String!) {
          work(pid: $pid) {
            workId
            titles { full }
          }
        }`,
    { pid },
  );
}

// 39568209 or 46182359 or 61895027 or 52735343 or 50792188 or 51537971 or 61411623 or 39567938
// phrase.subject="erotik" and term.genre="fiktion" and (term.type="lydbog (net)" or term.type="ebog") not term.category="børnematerialer"
// "term.type is not allowed as index, allowed indexes are [age, ages, datefirstedition, dk5, firstaccessiondate, hascover, id, let, lix, mediacouncilagerestriction, pegi, pid, publicationyear, variant_name, variants, workid, worktype, workyear, phrase.accesstype, phrase.ages, phrase.cataloguecode, phrase.childrentopic, phrase.contributor, phrase.contributorfunction, phrase.creator, phrase.creatorcontributor, phrase.creatorcontributorfunction, phrase.creatorfunction, phrase.fictionalcharacter, phrase.filmnationality, phrase.gameplatform, phrase.generalaudience, phrase.generalmaterialtype, phrase.genreandform, phrase.hostpublication, phrase.issue, phrase.language, phrase.libraryrecommendation, phrase.mainlanguage, phrase.mediacouncilagerestriction, phrase.mood, phrase.musicalensembleorcast, phrase.narrativetechnique, phrase.pegi, phrase.players, phrase.primarytarget, phrase.series, phrase.setting, phrase.specificmaterialtype, phrase.spokenlanguage, phrase.subject, phrase.subtitlelanguage, phrase.typeofscore, term.accesstype, term.canalwaysbeloaned, term.childrenoradults, term.childrentopic, term.contributor, term.creator, term.creator_notes, term.creatorcontributor, term.default, term.dk5heading, term.fictionalcharacter, term.fictionnonfiction, term.function, term.gameplatform, term.generalmaterialtype, term.genreandform, term.hostpublication, term.isbn, term.mainlanguage, term.mood, term.narrativetechnique, term.notes, term.publisher, term.schooluse, term.series, term.setting, term.source, term.specificmaterialtype, term.spokenlanguage, term.subject, term.subtitlelanguage, term.title, term.titlemanifestationpart] at: --->term.type=\"lydbog (net)\""

export async function search({
  query,
  offset = 0,
  limit = 20,
  cql,
  agency = "",
  token,
  searchProfile,
}) {
  if(token) {
    bearer = token
  } else if (agency !== currentAgency) {
    bearer = server.fbiToken(agency);
    currentAgency = agency;
  }
  let result;
  if (cql) {
    result = await fbi(
      `
query Example_ComplexSearch($cql: String!, $offset: Int!, $limit: PaginationLimitScalar!, $filters: ComplexSearchFiltersInput!, $sort: [SortInput!]) {
  complexSearch(cql: $cql, filters: $filters) {
    hitcount
    errorMessage
    works(offset: $offset, limit: $limit, sort: $sort) {
            manifestations { mostRelevant { 
                creators { display }
                titles { full }
                pid
                abstract
                materialTypes { materialTypeSpecific {code display}}
                edition { summary }
                cover { detail }
                workYear { year }
            } }
    }
  }
} `,
      {
        cql: cql,
        filters: {},
        sort: [
          {
            index: "sort.latestpublicationdate",
            order: "ASC",
          },
        ],
        offset: offset,
        limit: limit,
      },
      {searchProfile}
    );

    result = result?.complexSearch?.works;
    if (result)
      result = result.map((o) => o?.manifestations?.mostRelevant?.[0]);
  } else {
    result = await fbi(
      `
      query ($q: SearchQuery!, $offset: Int!, $limit: PaginationLimit!) {
        search(q: $q) {
          works(offset: $offset, limit: $limit) {
            manifestations { bestRepresentation { 
                creators { display }
                titles { full }
                pid
                materialTypes { materialTypeSpecific {code display}}
                edition { summary }
                cover { detail }
                workYear { year }
            } }
          }
        }
      }`,
      { q: query, offset: offset * limit, limit },
    );
    result = result?.search?.works;
    if (result)
      result = result.map((o) => o?.manifestations?.bestRepresentation);
  }
  return result;
}

export async function related(pid = "870970-basis:48953786", limit = 60) {
  return (
    await fbi(
      `
    query ($pid: String!, $limit: Int!) {
        recommend(pid: $pid, limit: $limit) {
          result {
            work {
              manifestations { bestRepresentation { 
                creators { display }
                titles { full }
                pid
                materialTypes { materialTypeSpecific {code display}}
                edition { summary }
                cover { detail }
                workYear { year }
              } }
            }
          }
        }
      }
      `,
      { pid, limit },
    )
  )?.recommend?.result?.map((o) => o?.work?.manifestations?.bestRepresentation);
}

async function manifest(pid = "870970-basis:48953786") {
  return fbi(
    `
      query ($pid: String!) {
        manifestation(pid: $pid) {
          ${manifestFields()}
        }
      }`,
    { pid },
  );
}
function manifestFields() {
  return `
abstract
access {__typename}
accessTypes { code display }
audience { let lix ages {begin end display} schoolUse { code display} primaryTarget generalAudience childrenOrAdults {code display} libraryRecommendation}
catalogueCodes {otherCatalogues nationalBibliography}
classifications {code system display entryType dk5Heading}
contributors {roles {function {plural singular} functionCode} display nameSort}
contributorsFromDescription
cover {detail origin detail_500}
creators {roles {function {plural singular} functionCode} display nameSort}
creatorsFromDescription
dateFirstEdition { year display endYear frequency}
edition {note summary edition contributors publicationYear {year display endYear frequency}}
fictionNonfiction {display code}
genreAndForm
hostPublication {issn isbn year {year display endYear frequency} title issue notes pages series {title members {work {workId} readThisFirst numberInSeries readThisWhenever} isPopular workTypes description readThisFirst mainLanguages parallelTitles readThisWhenever alternativeTitles} creator edition summary publisher}
identifiers { type value}
languages { main {display isoCode} notes spoken {display isoCode} original {display isoCode} parallel {display isoCode} abstract {display isoCode} subtitles {display isoCode}}
latestPrinting {summary printing publisher publicationYear {year display endYear frequency}}
manifestationParts {type parts {title creators {roles {function {plural singular} functionCode} display nameSort} subjects {type local display language { display isoCode}} playingTime classifications {code system display entryType dk5Heading} creatorsFromDescription contributorsFromDescription} heading}
materialTypes {materialTypeGeneral {code display} materialTypeSpecific {code display}}
notes {type heading display}
ownerWork { workId manifestations { all {
    pid
    titles { full }
    creators { display }
    cover { detail }
    workYear { year }
    materialTypes { materialTypeSpecific { code display } }
    edition { summary }
}}}
physicalDescriptions {size extent summary playingTime requirements numberOfPages numberOfUnits textVsIllustrations accompanyingMaterial technicalInformation additionalDescription}
pid
publisher
recordCreationDate
relatedPublications { url issn isbn title faust heading urlText}
relations {continuedIn {pid} continues {pid} discussedIn {pid} discusses {pid} hasAdaptation {pid} hasAnalysis {pid} hasCreatorDescription {pid} hasDescriptionFromPublisher {pid} hasManuscript {pid} hasReusedReview {pid} hasReview {pid} hasSoundtrack {pid} isAdaptationOf {pid} isAnalysisOf {pid} isDescriptionFromPublisherOf {pid} isManuscriptOf {pid} isReusedReviewOf {pid} isReviewOf {pid} isSoundtrackOfGame {pid}  isSoundtrackOfMovie {pid}  hasTrack {pid} isPartOfAlbum {pid}  isPartOfManifestation {pid} }
review {rating reviewByLibrarians {type content heading manifestations {pid} contentSubstitute}}
series {title members {work { workId } readThisFirst numberInSeries readThisWhenever} isPopular workTypes description readThisFirst mainLanguages parallelTitles readThisWhenever alternativeTitles}
shelfmark {postfix shelfmark}
source
subjects {all {display type language {display isoCode} local} dbcVerified {display type language {display isoCode} local}}
tableOfContents { heading content listOfContent { heading content listOfContent { heading content listOfContent { heading content listOfContent { heading content listOfContent { heading content listOfContent {heading content}}}}}}}
titles { main full alternative identifyingAddition original parallel standard translated tvSeries {disc {display numbers} title season {display numbers} volume {display numbers} episode {display numbers} episodeTitles danishLaunchTitle}}
universes {title works {workId} series {title members {work {workId}}} description alternativeTitles}
volume
workTypes
workYear {year display endYear frequency}
    `;
}

let requests = {};

let running = {};

async function handleRequest(scope, store, updateQuery) {
  if (running[scope]) return;
  running[scope] = true;
  try {
    const dispatch = store.dispatch;
    let query, result;
    while (query != requests[scope]) {
      query = requests[scope];
      if (scope === "searchResult") {
        result = await search({ all: query });
        result = result?.search?.works?.map(
          (o) => o?.manifestations?.bestRepresentation,
        );
      } else if (scope === "completion") {
        result = await suggest(query);
        result = result?.suggest?.result;
      } else if (scope === "work") {
        result = (await manifest(query))?.manifestation;
      } else if (scope === "related") {
        result = await related(query, 30);
      } else {
        console.log("TODO: handle", scope);
        break;
      }
      dispatch(updateQuery({ scope, query, result }));
    }
  } catch (e) {
    console.error(e);
  }
  running[scope] = false;
}

export function reactiveHandler(store, searchSlice) {
  return (scope, query) => {
    if (requests[scope] === query) return;
    requests[scope] = query;
    handleRequest(scope, store, searchSlice.actions.addResult);
  };
}
