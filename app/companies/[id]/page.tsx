"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CompanyProfile } from "@/components/cards/CompanyCard";
import { CompanyEditModal } from "@/components/modals/CompanyEditModal";
import { client } from "@/sanity/lib/client";
import { GlassCard } from "@/components/UI/GlassCard";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  ExternalLink,
  MessageSquare,
  Building2,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  Edit3,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export default function CompanyProfilePage() {
  const params = useParams();
  const { user } = useUser();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const query = `*[_type == "company" && _id == $id][0] {
        _id,
        name,
        tagline,
        bio,
        website,
        teamSize,
        industries,
        customIndustries,
        companyType,
        logo {
          asset-> {
            url
          }
        },
        banner {
          asset-> {
            url
          }
        },
        createdBy,
        createdAt,
        updatedAt
      }`;

      const result = await client.fetch<CompanyProfile>(query, {
        id: params.id,
      });
      setCompany(result);
    } catch (err) {
      console.error("Error fetching company:", err);
      setError("Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchCompany();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-white/5 rounded-xl" />
            <div className="h-32 bg-white/5 rounded-xl" />
            <div className="h-24 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">
            Company Not Found
          </h1>
          <p className="text-gray-400">
            {error || "The company you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  const companyLogo =
    company.logo?.asset?.url || "/images/placeholder-company-logo.svg";
  const companyBanner =
    company.banner?.asset?.url || "/images/placeholder-company-banner.svg";

  const allIndustries = [
    ...(company.industries || []),
    ...(company.customIndustries || []),
  ];

  // Check if current user is the owner of this company
  const isOwner = user?.id === company.createdBy;

  const handleCompanyUpdate = (updatedCompany: CompanyProfile) => {
    setCompany(updatedCompany);
    // Optionally refetch the data to ensure we have the latest version
    if (params.id) {
      fetchCompany();
    }
  };

  const getCompanyTypeColor = () => {
    switch (company.companyType) {
      case "agent":
        return "bg-blue-900/30 border-blue-500/40 text-blue-200";
      case "client":
        return "bg-green-900/30 border-green-500/40 text-green-200";
      default:
        return "bg-gray-900/30 border-gray-500/40 text-gray-200";
    }
  };

  const getCompanyTypeLabel = () => {
    switch (company.companyType) {
      case "agent":
        return "Service Provider";
      case "client":
        return "Seeking Services";
      default:
        return "Company";
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner and Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="overflow-hidden" padding="p-0">
            {/* Banner */}
            <div className="relative h-40 sm:h-48">
              <Image
                src={companyBanner}
                alt={`${company.name} Banner`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />

              {/* Company Type Badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className={`${getCompanyTypeColor()}`}>
                  {getCompanyTypeLabel()}
                </Badge>
              </div>
            </div>

            {/* Company Info */}
            <div className="relative px-6 pb-6">
              {/* Logo */}
              <div className="absolute -top-12 w-24 h-24 rounded-xl overflow-hidden border-4 border-white/20">
                <Image
                  src={companyLogo}
                  alt={`${company.name} Logo`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name and Actions */}
              <div className="pt-16 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {company.name}
                  </h1>
                  {company.tagline && (
                    <p className="text-lg text-gray-300 mb-2">
                      {company.tagline}
                    </p>
                  )}
                  {company.teamSize && (
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <Users className="h-4 w-4" />
                      <span>{company.teamSize}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {isOwner && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2  text-purple-300 hover:bg-purple-800/30 p-2 rounded-full"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                  {company.website && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          company.website!.startsWith("http")
                            ? company.website!
                            : `https://${company.website!}`,
                          "_blank"
                        )
                      }
                      className="flex items-center gap-2 p-2 rounded-full"
                    >
                      Website
                      <Globe className="h-4 w-4" />
                    </Button>
                  )}
                  {!isOwner && (
                    <Button className="flex items-center gap-2 p-2 rounded-full">
                      <MessageSquare className="h-4 w-4" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Company Description */}
        {company.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed">{company.bio}</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Industries */}
        {allIndustries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-4">
                Industries
              </h2>
              <div className="flex flex-wrap gap-2">
                {allIndustries.map((industry, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-purple-900/30 border-purple-500/40 text-purple-200"
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Company Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4">
              Company Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="text-white">{getCompanyTypeLabel()}</p>
                </div>
              </div>

              {company.teamSize && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Team Size</p>
                    <p className="text-white">{company.teamSize}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Founded</p>
                  <p className="text-white">
                    {new Date(company.createdAt).getFullYear()}
                  </p>
                </div>
              </div>

              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Website</p>
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {company && (
        <CompanyEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          company={company}
          onUpdate={handleCompanyUpdate}
        />
      )}
    </div>
  );
}
