import { getApiBaseUrl } from "@/lib/api-base-url";
import type {
  AboutPageContent,
  AboutPageUpdatePayload,
  TeamMemberApiModel,
  TeamMemberWritePayload,
} from "@/types/about-page";

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as Record<string, unknown>;
    if (typeof data.detail === "string") return data.detail;
    const first = Object.values(data)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    if (typeof first === "string") return first;
  } catch {
    /* ignore */
  }
  return `Error ${response.status}`;
}

export async function getAboutPageContent(options?: {
  revalidate?: number | false;
}): Promise<AboutPageContent> {
  const response = await fetch(`${getApiBaseUrl()}/about-page/current/`, {
    ...(options?.revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate: options?.revalidate ?? 30 } }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as AboutPageContent;
}

export async function updateAboutPageContent(
  payload: AboutPageUpdatePayload,
): Promise<AboutPageContent> {
  const response = await fetch(`${getApiBaseUrl()}/about-page/current/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as AboutPageContent;
}

export async function uploadAboutMissionImage(
  file: File,
): Promise<AboutPageContent> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(
    `${getApiBaseUrl()}/about-page/current/mission-image/`,
    { method: "POST", body: form },
  );
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as AboutPageContent;
}

export async function uploadAboutVisionImage(
  file: File,
): Promise<AboutPageContent> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(
    `${getApiBaseUrl()}/about-page/current/vision-image/`,
    { method: "POST", body: form },
  );
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as AboutPageContent;
}

export async function listTeamMembersApi(options?: {
  all?: boolean;
  revalidate?: number | false;
}): Promise<TeamMemberApiModel[]> {
  const query = options?.all ? "?all=1" : "";
  const response = await fetch(`${getApiBaseUrl()}/team-members/${query}`, {
    ...(options?.revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate: options?.revalidate ?? 30 } }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const data = (await response.json()) as
    | TeamMemberApiModel[]
    | { results: TeamMemberApiModel[] };
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function createTeamMemberApi(
  payload: TeamMemberWritePayload,
): Promise<TeamMemberApiModel> {
  const response = await fetch(`${getApiBaseUrl()}/team-members/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as TeamMemberApiModel;
}

export async function updateTeamMemberApi(
  slug: string,
  payload: TeamMemberWritePayload,
): Promise<TeamMemberApiModel> {
  const response = await fetch(`${getApiBaseUrl()}/team-members/${slug}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as TeamMemberApiModel;
}

export async function deleteTeamMemberApi(slug: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/team-members/${slug}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}

export async function uploadTeamMemberPhotoApi(
  slug: string,
  file: File,
): Promise<TeamMemberApiModel> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(
    `${getApiBaseUrl()}/team-members/${slug}/photo/`,
    { method: "POST", body: form },
  );
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const data = (await response.json()) as {
    member: TeamMemberApiModel;
  };
  return data.member;
}
