"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageProvider";
import { t } from "i18next";

export function NavMain({ items, searchQuery }) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({});
  const { language } = useLanguage();

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const expanded = {};
      items.forEach((group) => {
        expanded[group.label] = true;
        group.items?.forEach((subItem) => {
          expanded[subItem.label] = true;
        });
      });
      setOpenGroups(expanded);
    }
  }, [searchQuery, items]);

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderChevron = (isOpen) =>
    language === "ar" ? (
      <ChevronLeft
        className={`ml-auto transition-transform duration-200 ${isOpen ? "-rotate-90" : ""
          }`}
      />
    ) : (
      <ChevronRight
        className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-90" : ""
          }`}
      />
    );

  const renderPlusButton = (plusLink) => (
    <Link
      to={plusLink}
      onClick={(e) => e.stopPropagation()}
      className="flex items-center justify-center hover:text-primary"
    >
      <Button variant="sidebarAdd" className="ml-auto">
        <Plus size={16} />
      </Button>
    </Link>
  );
  const { open } = useSidebar();

  const renderItemContent = (item) => {
    return (
      <div
        className={`flex w-full items-center ${open ? "overflow-hidden" : ""
          }  ${item.isPlus && item.plusLink ? "justify-between" : "justify-start"
          }`}
      >
        <div
          className={`flex group items-center gap-2  ${open ? "overflow-hidden" : ""
            } flex-1`}
        >
          {item.icon && (
            <item.icon
              className={`size-[20px] text-[#1b3884] dark:text-[#7492DF] group-hover/icon:text-[#eb702d] transition-colors duration-200 ${location?.pathname === item?.path ? "!text-[#eb702d]" : ""
                }`}
            />
          )}
          <span className="truncate" title={item.label}>
            {item.label}
          </span>
        </div>
        {item.isPlus && item.plusLink && renderPlusButton(item.plusLink)}
      </div>
    );
  };

  const renderLink = (item) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={`flex group/icon items-center px-4 py-3 rounded-md transition-colors w-full ${isActive
          ? "bg-gray-200 dark:bg-gray-600"
          : "text-gray-700 hover:bg-gray-100"
          }`}
      >
        {renderItemContent(item)}
      </Link>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("Menu")}</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item) => (
          <SidebarMenuItem key={item.label}>
            {item.items?.length > 0 ? (
              <Collapsible asChild open={!!openGroups[item.label]}>
                <div>
                  <SidebarMenuButton
                    tooltip={item.label}
                    onClick={() => toggleGroup(item.label)}
                    className=" group/icon"
                  >
                    {renderItemContent(item)}
                    {renderChevron(!!openGroups[item.label])}
                  </SidebarMenuButton>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) =>
                        subItem.permission ? (
                          <SidebarMenuSubItem key={subItem.label}>
                            {subItem.items?.length > 0 ? (
                              <Collapsible
                                asChild
                                open={!!openGroups[subItem.label]}
                              >
                                <div>
                                  <SidebarMenuSubButton
                                    tooltip={subItem.label}
                                    onClick={() => toggleGroup(subItem.label)}
                                    className=" group/icon"
                                  >
                                    {renderItemContent(subItem)}
                                    {renderChevron(!!openGroups[subItem.label])}
                                  </SidebarMenuSubButton>
                                  <CollapsibleContent>
                                    <SidebarMenuSub>
                                      {subItem.items.map((nestedItem) => (
                                        <SidebarMenuSubItem
                                          key={nestedItem.label}
                                        >
                                          <SidebarMenuSubButton asChild>
                                            {renderLink(nestedItem)}
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </div>
                              </Collapsible>
                            ) : (
                              <SidebarMenuSubButton asChild>
                                {renderLink(subItem)}
                              </SidebarMenuSubButton>
                            )}
                          </SidebarMenuSubItem>
                        ) : null
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ) : (
              <SidebarMenuButton tooltip={item.label}>
                {item.icon && <item.icon />}
                <span>{item.label}</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}