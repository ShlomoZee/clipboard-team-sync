const teamManagementHandler = (() => {
    let teamMembers = [];

    const normalizeMember = (member) => {
        return member.trim().toLowerCase();
    };

    const addMember = (member) => {
        const normalizedMember = normalizeMember(member);
        if (!teamMembers.includes(normalizedMember)) {
            teamMembers.push(normalizedMember);
            notifyTeam();
        }
    };

    const removeMember = (member) => {
        const normalizedMember = normalizeMember(member);
        if (teamMembers.includes(normalizedMember)) {
            teamMembers = teamMembers.filter(m => m !== normalizedMember);
            notifyTeam();
        }
    };

    const getMembers = () => {
        return teamMembers;
    };

    const notifyTeam = () => {
        // Logic to notify all team members about the updated list
        // Replace the console log with actual notification logic
        // For demonstration purposes, we're still logging to console
        console.log("Updated team members:", teamMembers);
        // Potential notification logic goes here (e.g., email, in-app notification)
    };

    return {
        addMember,
        removeMember,
        getMembers
    };
})();

// Example usage
teamManagementHandler.addMember('john.doe@example.com');
teamManagementHandler.addMember('jane.smith@example.com');
console.log(teamManagementHandler.getMembers());
teamManagementHandler.removeMember('john.doe@example.com');
console.log(teamManagementHandler.getMembers());