import type { OrgChartNode } from "@/types/company";

interface AboutOrgChartProps {
  root: OrgChartNode;
}

function OrgChartNodeCard({ node }: { node: OrgChartNode }) {
  return (
    <div className="w-full max-w-[16rem]">
      <div className="rounded-xl border border-tl-gold/30 bg-[#22221c]/90 px-4 py-3 text-center shadow-[0_8px_24px_-12px_rgba(0,0,0,0.65)] sm:px-5 sm:py-3.5">
        <p className="font-outfit text-sm font-extralight leading-tight text-tl-beige sm:text-lg">
          {node.name}
        </p>
        <p className="mt-1 font-outfit text-[9px] font-light uppercase tracking-[0.14em] text-tl-gold/85 sm:text-[10px]">
          {node.role}
        </p>
      </div>
    </div>
  );
}

function OrgChartBranchDesktop({ node }: { node: OrgChartNode }) {
  const children = node.children ?? [];

  if (children.length === 0) {
    return <OrgChartNodeCard node={node} />;
  }

  return (
    <div className="flex flex-col items-center">
      <OrgChartNodeCard node={node} />
      <div className="h-6 w-px bg-tl-gold/35 sm:h-8" aria-hidden />
      <div className="relative flex w-full justify-center">
        {children.length > 1 ? (
          <div className="absolute top-0 h-px w-[calc(100%-4rem)] max-w-[calc(100%-2rem)] bg-tl-gold/35 sm:w-[calc(100%-6rem)]" />
        ) : null}
        <ul className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
          {children.map((child) => (
            <li key={child.id} className="flex flex-col items-center">
              <div className="h-6 w-px bg-tl-gold/35 sm:h-8" aria-hidden />
              <OrgChartBranchDesktop node={child} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function OrgChartBranchMobile({
  node,
  depth = 0,
}: {
  node: OrgChartNode;
  depth?: number;
}) {
  const children = node.children ?? [];

  return (
    <li className="relative">
      <div style={{ paddingLeft: `${depth * 1.25}rem` }}>
        <OrgChartNodeCard node={node} />
      </div>
      {children.length > 0 ? (
        <ul className="mt-3 space-y-3 border-l border-tl-gold/20 pl-4 sm:pl-5" style={{ marginLeft: `${depth * 1.25 + 0.5}rem` }}>
          {children.map((child) => (
            <OrgChartBranchMobile key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function AboutOrgChart({ root }: AboutOrgChartProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-[2px] sm:p-8">
      {/* Móvil: árbol vertical legible */}
      <ul className="space-y-3 lg:hidden">
        <OrgChartBranchMobile node={root} />
      </ul>

      {/* Desktop: diagrama horizontal */}
      <div className="hidden overflow-x-auto lg:block">
        <div className="mx-auto min-w-max py-2">
          <OrgChartBranchDesktop node={root} />
        </div>
      </div>
    </div>
  );
}
